import { ArtistsModel } from "../artists/artists.model";
import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } 
    from "sequelize-typescript";
import { SongArtistsAttributes, SongArtistsCreationAttributes } from "src/types/songArtistsAttributes";

@Table({
    tableName: "song_artists_rp",
    underscored: true,
    timestamps: false
}) export class SongArtistsModel extends Model<SongArtistsAttributes, SongArtistsCreationAttributes> {
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

    @ForeignKey(() => ArtistsModel)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare artist_id: number;

    @BelongsTo(() => ArtistsModel)
    artist: ArtistsModel;
};