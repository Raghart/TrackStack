import { SongArtistsModel } from "../song_artists/songArtists.model";
import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } 
    from "sequelize-typescript";
import { ArtistsAttributtes, ArtistsCreationAttributtes } from "src/types/artistAttributes";

@Table({
    tableName: "artists",
    underscored: true,
    timestamps: false
}) export class ArtistsModel extends Model<ArtistsAttributtes, ArtistsCreationAttributtes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @BelongsToMany(() => SongsModel, () => SongArtistsModel)
    songs: SongsModel[];
};