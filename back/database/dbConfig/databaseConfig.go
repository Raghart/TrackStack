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

func (cfg *DbConfig) AddSongsDatabase(records [][]string) {
	fmt.Println("Addings songs to the database...")
	for idx, songRecord := range records {
		if idx == 0 {
			continue
		}

		songStrID := songRecord[0]
		songName := songRecord[1]
		songSpotify := songRecord[2]
		songUrlPreview := songRecord[3]
		songDurationStr := songRecord[4]
		songYearStr := songRecord[5]
		songAlbumIDStr := songRecord[6]

		songAlbumID, err := strconv.Atoi(songAlbumIDStr)
		if err != nil {
			log.Fatal(err)
		}

		albumData, err := cfg.Queries.GetAlbumByID(context.Background(), int32(songAlbumID))
		if err != nil {
			log.Fatalf("album with the ID: %v not in database: %v", songAlbumID, err)
		}

		songDuration, err := strconv.ParseFloat(songDurationStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		songID, err := strconv.Atoi(songStrID)
		if err != nil {
			log.Fatal(err)
		}

		songYear, err := strconv.Atoi(songYearStr)
		if err != nil {
			log.Fatal(err)
		}

		addedSong, err := cfg.Queries.CreateSong(context.Background(), database.CreateSongParams{
			ID:         int32(songID),
			Name:       songName,
			SpotifyID:  songSpotify,
			UrlPreview: songUrlPreview,
			Duration:   float32(songDuration),
			Year:       int32(songYear),
			AlbumID:    albumData.ID,
		})

		if err != nil {
			log.Fatalf("error while trying to add the song: %v", err)
		}

		fmt.Println(addedSong)
	}

	fmt.Println("Finish adding songs!")
}

func (cfg *DbConfig) AddSongsArtistsDatabase(records [][]string) {
	fmt.Println("Processing the relationship between song and artists...")
	for idx, record := range records {
		if idx == 0 {
			continue
		}

		songArtistStrID := record[0]
		songStrID := record[1]
		artistStrID := record[2]

		songArtistID, err := strconv.Atoi(songArtistStrID)
		if err != nil {
			log.Fatal(err)
		}

		songID, err := strconv.Atoi(songStrID)
		if err != nil {
			log.Fatal(err)
		}

		artistID, err := strconv.Atoi(artistStrID)
		if err != nil {
			log.Fatal(err)
		}

		dbSong, err := cfg.Queries.GetSongByID(context.Background(), int32(songID))
		if err != nil {
			log.Fatalf("error while trying to get the song: %v", err)
		}

		dbArtist, err := cfg.Queries.GetArtistByID(context.Background(), int32(artistID))
		if err != nil {
			log.Fatalf("error while trying to get the artist: %v", err)
		}

		addedArtistSong, err := cfg.Queries.CreateSongArtist(context.Background(), database.CreateSongArtistParams{
			ID:       int32(songArtistID),
			SongID:   dbSong.ID,
			ArtistID: dbArtist.ID,
		})

		if err != nil {
			log.Fatalf("error while trying to create the artist song rp: %v", err)
		}

		fmt.Println(addedArtistSong)
	}
	fmt.Println("Finish processing the relationship!")
}

func (cfg *DbConfig) AddSongGenresDatabase(records [][]string) {
	fmt.Println("Processing the song genres relationship...")
	for idx, record := range records {
		if idx == 0 {
			continue
		}

		songGenreStrID := record[0]
		songStrID := record[1]
		genreStrID := record[2]

		songGenreID, err := strconv.Atoi(songGenreStrID)
		if err != nil {
			log.Fatal(err)
		}

		songID, err := strconv.Atoi(songStrID)
		if err != nil {
			log.Fatal(err)
		}

		genreID, err := strconv.Atoi(genreStrID)
		if err != nil {
			log.Fatal(err)
		}

		genreDB, err := cfg.Queries.GetGenreByID(context.Background(), int32(genreID))
		if err != nil {
			log.Fatal(err)
		}

		songDB, err := cfg.Queries.GetSongByID(context.Background(), int32(songID))
		if err != nil {
			log.Fatal(err)
		}

		addedSongGenre, err := cfg.Queries.CreateSongGenre(context.Background(), database.CreateSongGenreParams{
			ID:      int32(songGenreID),
			SongID:  songDB.ID,
			GenreID: genreDB.ID,
		})

		if err != nil {
			log.Fatalf("error while trying to add a song genre rp: %v", err)
		}
		fmt.Println(addedSongGenre)
	}
	fmt.Println("Finish processing the relationship!")
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
