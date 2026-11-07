## Features

### Get personalized recommendations

1. Open the recommendation modal with the **beam note** button in the top-right corner.
2. Pick one or more genres and adjust the sliders and switches (energy, danceability, mood, sentiment, tempo, and more).
3. Press **Send Data**. The app builds a weighted vector, requests the matching songs, and streams an AI description of the selection.

<p align="center">
    <img src="../assets/Modal.png" alt="Recommendation modal" />
</p>

<p align="center">
    <img src="../assets/RecommendationResults.png" alt="Recommendation results" />
</p>

### Search songs, artists, and albums

The search bar in the top navbar sends the query to `multipleSearch` and shows exact matches plus the remaining fuzzy results, all served by the backend's PostgreSQL search.

<p align="center">
    <img src="../assets/songSearch.png" alt="Search results" />
</p>

### Listen to 30-second previews

Hover over a song cover and press play. The player at the bottom shows the current track and elapsed time, and includes random, previous, next, and volume controls.

<p align="center">
    <img src="../assets/playSong.png" alt="Song preview player" />
</p>

### Explore track details

Clicking a song title opens its detail page with artists, genres, duration, release year, album, and a link to Spotify.

<p align="center">
    <img src="../assets/songDetails.png" alt="Song details" />
</p>

### Browse artists, genres, and albums

The left sidebar links to the artist, genre, and album catalogues. Each catalogue supports infinite scrolling, and every card opens the corresponding detail page.

<p align="center">
    <img src="../assets/artists.png" alt="Artists catalogue" />
</p>

<p align="center">
    <img src="../assets/artistPage.png" alt="Songs by artist" />
</p>

<p align="center">
    <img src="../assets/Genres.png" alt="Genres catalogue" />
</p>

<p align="center">
    <img src="../assets/albums.png" alt="Albums catalogue" />
</p>

<p align="center">
    <img src="../assets/albumSongs.png" alt="Songs in an album" />
</p>