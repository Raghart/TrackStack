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
		artist, err := cfg.Queries.CreateArtist(context.Background(), database.CreateArtistParams{
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

func (cfg *DbConfig) AddGenresDatabase(records [][]string) {
	fmt.Println("Adding the genres to the database...")
	for idx, genre := range records {
		if idx == 0 {
			continue
		}

		genreStrID := genre[0]
		genreName := genre[1]

		genreID, err := strconv.Atoi(genreStrID)
		if err != nil {
			log.Fatal(err)
		}

		genreAdded, err := cfg.Queries.CreateGenre(context.Background(), database.CreateGenreParams{
			ID:    int32(genreID),
			Genre: genreName,
		})

		if err != nil {
			log.Fatalf("there was a problem while trying to add the genre")
		}

		fmt.Println(genreAdded)
	}
	fmt.Println("Finish adding genres!")
}

func (cfg *DbConfig) AddAlbumsDatabase(records [][]string) {
	fmt.Println("Adding albums to the database...")
	for idx, albumRecord := range records {
		if idx == 0 {
			continue
		}

		albumStrId := albumRecord[0]
		albumName := albumRecord[1]
		albumUrlImg := albumRecord[2]

		albumID, err := strconv.Atoi(albumStrId)
		if err != nil {
			log.Fatalf("%v is not a valid string: %v", albumStrId, err)
		}

		addedAlbum, err := cfg.Queries.CreateAlbum(context.Background(), database.CreateAlbumParams{
			ID:       int32(albumID),
			Name:     albumName,
			UrlImage: albumUrlImg,
		})

		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(addedAlbum)
	}
	fmt.Println("Finish adding albums!")
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
