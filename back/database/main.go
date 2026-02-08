package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"
	databaseConfig "scripts/dbConfig"
	"scripts/internal/database"
	paths "scripts/pathConstants"

	_ "github.com/lib/pq"
)

func main() {
	serviceURI := "postgresql://postgres:postgres@localhost:5432/music_db?sslmode=disable"

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

	dbCfg := databaseConfig.DbConfig{
		Queries: database.New(db),
	}

	switch os.Args[1] {
	case "artists":
		{
			databaseConfig.AddToDatabase(paths.ARTISTPATH, dbCfg.AddArtistsDatabase)
		}
	case "genres":
		{
			databaseConfig.AddToDatabase(paths.GenresPath, dbCfg.AddGenresDatabase)
		}
	case "albums":
		{
			databaseConfig.AddToDatabase(paths.AlbumsPath, dbCfg.AddAlbumsDatabase)
		}
	case "songs":
		{
			databaseConfig.AddToDatabase(paths.SongsPath, dbCfg.AddSongsDatabase)
		}
	case "song_artists":
		{
			databaseConfig.AddToDatabase(paths.SongArtistsPath, dbCfg.AddSongsArtistsDatabase)
		}
	case "song_genres":
		{
			databaseConfig.AddToDatabase(paths.SongGenresPath, dbCfg.AddSongGenresDatabase)
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
