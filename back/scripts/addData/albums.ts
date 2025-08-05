import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { AlbumAttributes, AlbumCreationAttributes } from "../../src/types/albumAttributes";

export class Albums extends Model<AlbumAttributes, AlbumCreationAttributes> {};
Albums.init({
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
    url_image: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "albums"
});