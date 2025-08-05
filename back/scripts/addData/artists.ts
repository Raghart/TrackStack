import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { ArtistsAttributtes, ArtistsCreationAttributtes } from "../../src/types/artistAttributes";

export class Artists extends Model<ArtistsAttributtes, ArtistsCreationAttributtes> {}
Artists.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "artists"
});