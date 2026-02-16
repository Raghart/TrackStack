import { GenresModel } from "../genres/genres.model";
import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } 
    from "sequelize-typescript";
import { SongGenresAttributes, SongGenresCreationAttributes } from "src/types/songGenresAttributes";

@Table({
    tableName: "song_genres",
    underscored: true,
    timestamps: false
}) export class SongGenresModel extends Model<SongGenresAttributes, SongGenresCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => SongsModel)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare song_id: number;

    @BelongsTo(() => SongsModel)
    song: SongsModel;

    @ForeignKey(() => GenresModel)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare genre_id: number;

    @BelongsTo(() => GenresModel)
    genre: GenresModel;
};