import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, AllowNull, Unique, ForeignKey, 
    BelongsTo, HasOne, BelongsToMany } from "sequelize-typescript";
import { SongAttributes, SongCreationAttributes } from "src/types/songAttributes";
import { SongArtistsModel } from "../song_artists/songArtists.model";
import { AlbumsModel } from "../albums/albums.model";
import { ArtistsModel } from "../artists/artists.model";
import { GenresModel } from "../genres/genres.model";
import { SongGenresModel } from "../song_genres/SongGenres.model";
import { SongDetailsModel } from "../song_details/SongDetails.model";

@Table({
    tableName: "songs",
    timestamps: false,
    underscored: true
})
export class SongsModel extends Model<SongAttributes, SongCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare spotify_id: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare url_preview: string;

    @AllowNull(false)
    @Column({
        type: DataType.NUMBER,
        validate: {
            min: 0,
            max: 6
        }
    })
    declare duration: number;

    @AllowNull(false)
    @Column({
        type: DataType.NUMBER,
        validate: {
            min: 1980,
            max: 2025
        },
    })
    declare year: number;

    @BelongsToMany(() => ArtistsModel, () => SongArtistsModel)
    artists: ArtistsModel[];

    @BelongsToMany(() => GenresModel, () => SongGenresModel)
    genres: GenresModel[];

    @ForeignKey(() => AlbumsModel)
    @AllowNull(false)
    @Column(DataType.NUMBER)
    declare album_id: number;

    @BelongsTo(() => AlbumsModel)
    album: AlbumsModel;

    @HasOne(() => SongDetailsModel)
    songDetails: SongDetailsModel;
};