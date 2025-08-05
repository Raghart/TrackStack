import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";

export class songGenres extends Model{}
songGenres.init({
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
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "genres", key: "id" }
    },
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "songGenres",
    tableName: "song_genres_rp"
})