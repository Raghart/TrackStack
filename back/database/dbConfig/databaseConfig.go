package databaseConfig

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"scripts/internal/database"
	"strconv"

	"github.com/pgvector/pgvector-go"
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

func (cfg *DbConfig) AddSongDetailsDatabase(records [][]string) {
	fmt.Println("Processing the song details...")
	for idx, record := range records {
		if idx == 0 {
			continue
		}

		songDetailsStrID := record[0]
		songStrID := record[1]
		danceabilityStr := record[2]
		energyStr := record[3]
		track_keyStr := record[4]
		loudnessStr := record[5]
		modeStr := record[6]
		speechinessStr := record[7]
		acousticnessStr := record[8]
		instrumentalnessStr := record[9]
		livenessStr := record[10]
		valenceStr := record[11]
		tempoStr := record[12]
		time_signatureStr := record[13]

		songDetailsID, err := strconv.Atoi(songDetailsStrID)
		if err != nil {
			log.Fatal(err)
		}

		songID, err := strconv.Atoi(songStrID)
		if err != nil {
			log.Fatal(err)
		}

		dbSong, err := cfg.Queries.GetSongByID(context.Background(), int32(songID))
		if err != nil {
			log.Fatal(err)
		}

		danceability, err := strconv.ParseFloat(danceabilityStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		energy, err := strconv.ParseFloat(energyStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		trackKey, err := strconv.ParseFloat(track_keyStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		loudness, err := strconv.ParseFloat(loudnessStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		mode, err := strconv.ParseFloat(modeStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		speechiness, err := strconv.ParseFloat(speechinessStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		acousticness, err := strconv.ParseFloat(acousticnessStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		instrumentalness, err := strconv.ParseFloat(instrumentalnessStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		liveness, err := strconv.ParseFloat(livenessStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		valence, err := strconv.ParseFloat(valenceStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		tempo, err := strconv.ParseFloat(tempoStr, 32)
		if err != nil {
			log.Fatal(err)
		}

		timeSignature, err := strconv.Atoi(time_signatureStr)
		if err != nil {
			log.Fatal(err)
		}

		added_details, err := cfg.Queries.CreateSongDetails(context.Background(), database.CreateSongDetailsParams{
			ID:               int32(songDetailsID),
			SongID:           dbSong.ID,
			Danceability:     float32(danceability),
			Energy:           float32(energy),
			TrackKey:         float32(trackKey),
			Loudness:         float32(loudness),
			Mode:             float32(mode),
			Speechiness:      float32(speechiness),
			Acousticness:     acousticness,
			Instrumentalness: instrumentalness,
			Liveness:         float32(liveness),
			Valence:          float32(valence),
			Tempo:            float32(tempo),
			TimeSignature:    int32(timeSignature),
		})

		if err != nil {
			log.Fatalf("error while trying to add the song details: %v", err)
		}

		fmt.Println(added_details)
	}
	fmt.Println("Finish processing the song details!")
}

func (cfg *DbConfig) AddVectorsDatabase() {
	fmt.Println("Processing vector to the database...")
	songDetails, err := cfg.Queries.GetSongDetails(context.Background())
	if err != nil {
		log.Fatalf("there was a problem while trying to get the songs details: %v", err)
	}

	for _, song := range songDetails {
		dbSong, err := cfg.Queries.GetSongByID(context.Background(), song.SongID)
		if err != nil {
			log.Fatalf("there was a problem while trying to get the song: %v", err)
		}

		loudnessNor := minMaxScaling(song.Loudness, float32(minLoudness), float32(maxLoudness))
		tempoNor := minMaxScaling(song.Tempo, float32(minTempo), float32(maxTempo))
		timeSigNor := minMaxScaling(float32(song.TimeSignature), float32(minTimeSig),
			float32(maxTimeSig))
		trackKeyNor := minMaxScaling(song.TrackKey, float32(minTrackKey), float32(maxTrackKey))
		durationNor := minMaxScaling(dbSong.Duration, float32(minDuration), float32(maxDuration))

		songParams := []float32{
			durationNor,
			song.Danceability,
			song.Energy,
			trackKeyNor,
			loudnessNor,
			song.Mode,
			song.Speechiness,
			float32(song.Acousticness),
			float32(song.Instrumentalness),
			song.Liveness,
			song.Valence,
			tempoNor,
			timeSigNor,
		}

		embedding := pgvector.NewVector(songParams)

		vectorAdded, err := cfg.Queries.CreateVector(context.Background(), database.CreateVectorParams{
			Vectors: embedding,
			SongID:  song.SongID,
		})

		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(vectorAdded)
	}
	fmt.Println("Finish processing the vectors!")
}

func minMaxScaling(value, dbMin, dbMax float32) float32 {
	return (value - dbMin) / (dbMax - dbMin)
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
