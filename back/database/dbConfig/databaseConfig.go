package databaseConfig

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"scripts/internal/database"
	"strconv"
)

type DbConfig struct {
	Queries *database.Queries
}

func AddToDatabase(path string, databaseMethod func([][]string)) {
	csvData, err := parseCSV(path)
	if err != nil {
		log.Fatalf("path not found: %v", err)
	}

	databaseMethod(csvData)
}

func (cfg *DbConfig) AddArtistsDatabase(records [][]string) {
	fmt.Println("Adding data to the artists table...")
	for idx, record := range records {
		if idx == 0 {
			continue
		}

		id, err := strconv.Atoi(record[0])
		if err != nil {
			log.Fatalf("id is not a valin number")
		}

		name := record[1]
		artist, err := cfg.Queries.AddArtist(context.Background(), database.AddArtistParams{
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

func parseCSV(path string) ([][]string, error) {
	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}

	reader := csv.NewReader(file)
	return reader.ReadAll()
}

type TableType string

const (
	ArtistsType TableType = "artists"
)
