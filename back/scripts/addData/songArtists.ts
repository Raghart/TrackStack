import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { SongArtistsAttributes, SongArtistsCreationAttributes } from "../../src/types/songArtistsAttributes";

export class SongArtists extends Model<SongArtistsAttributes, SongArtistsCreationAttributes> {}
SongArtists.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "songs", key: "id" }
    },
    artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "artists", key: "id" }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "songArtists",
    tableName: "song_artists_rp"
})