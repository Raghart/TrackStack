import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { SongAttributes, SongCreationAttributes } from "../../src/types/songAttributes";

export class Songs extends Model<SongAttributes, SongCreationAttributes> {}
Songs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    spotify_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url_preview: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 6
        }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1980,
            max: 2025
        }
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "albums", key: "id" }
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "songs"
})