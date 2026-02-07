package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"scripts/internal/database"
	"strconv"

	_ "github.com/lib/pq"
)

func main() {
	serviceURI := os.Getenv("LOCAL_DB_URI")
	var ARTISTPATH = filepath.Join("csv_data", "artists_rows.csv")

	if len(os.Args) != 2 {
		printHelp()
		return
	}

	conn, _ := url.Parse(serviceURI)
	conn.RawQuery = "sslmode=verify-ca;sslrootcert=ca.pem"

	db, err := sql.Open("postgres", conn.String())

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	queries := database.New(db)

	switch os.Args[1] {
	case "artists":
		{
			artistFile, err := os.Open(ARTISTPATH)
			if err != nil {
				log.Fatal(err)
			}

			defer artistFile.Close()
			reader := csv.NewReader(artistFile)
			records, err := reader.ReadAll()

			if err != nil {
				log.Fatalf("error while trying to read the records: %v", err)
			}
			fmt.Println("starting to print the records!")
			for idx, record := range records {
				if idx == 0 {
					continue
				}

				id, err := strconv.Atoi(record[0])
				if err != nil {
					log.Fatalf("id is not a valin number")
				}

				name := record[1]
				artist, err := queries.AddArtist(context.Background(), database.AddArtistParams{
					ID:   int32(id),
					Name: name,
				})

				if err != nil {
					log.Fatalf("error while trying to add the artist: %v", err)
				}

				fmt.Println(artist)
			}
			fmt.Println("the records has been added!")
		}
	default:
		{
			fmt.Printf("'%v' is not a valid command\n", os.Args[1])
			printHelp()
			return
		}
	}
}

func printHelp() {
	fmt.Println("Help:")
	fmt.Println("Usage: go run main.go [arg]")
	fmt.Println("Avaible Commands:")
	fmt.Println("'artists': to add the artists of a specific route.")
}
