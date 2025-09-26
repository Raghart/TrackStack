import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { GenresAttributes, GenresCreationAttributtes } from "../../src/types/genreAttributes";

export class Genres extends Model<GenresAttributes, GenresCreationAttributtes> {}
Genres.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "genres"
})