import { SongGenresModel } from "../song_genres/SongGenres.model";
import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } 
    from "sequelize-typescript";
import { GenresAttributes, GenresCreationAttributtes } from "src/types/genreAttributes";

@Table({
    tableName: "genres",
    underscored: true,
    timestamps: false
}) export class GenresModel extends Model<GenresAttributes, GenresCreationAttributtes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.NUMBER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare genre: string;

    @BelongsToMany(() => SongsModel, () => SongGenresModel)
    songs: SongsModel[];
};