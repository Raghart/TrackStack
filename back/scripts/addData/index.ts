import { Albums } from "./albums";
import { Artists } from "./artists";
import { Genres } from "./genres";
import { Songs } from "./song";
import { SongArtists } from "./songArtists";
import { songDetails } from "./songDetails";
import { songGenres } from "./songGenres";

Songs.hasOne(songDetails, { foreignKey: "song_id", as: "details" });
songDetails.belongsTo(Songs, { foreignKey: "song_id" });

Albums.hasMany(Songs, { foreignKey: "album_id" });
Songs.belongsTo(Albums, { foreignKey: "album_id" });

Songs.belongsToMany(Genres, { through: songGenres, as: "song_genres" });
Genres.belongsToMany(Songs, { through: songGenres, as: "track_genres" });

Songs.belongsToMany(Artists, { through: SongArtists, as: "song_artists" });
Artists.belongsToMany(Songs, { through: SongArtists, as:"artists_tracks" });