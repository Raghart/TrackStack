import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { AlbumAttributes, AlbumCreationAttributes } from "src/types/albumAttributes";

@Table({
    tableName: "albums",
    underscored: true,
    timestamps: false
})
export class AlbumsModel extends Model<AlbumAttributes, AlbumCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.NUMBER)
    declare id: number;

    @AllowNull
    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull
    @Unique
    @Column(DataType.STRING)
    declare url_image: string;

    @HasMany(() => SongsModel)
    songs: SongsModel[];
};