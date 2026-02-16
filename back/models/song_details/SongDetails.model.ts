import { SongsModel } from "../songs/song.model";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } 
    from "sequelize-typescript";
import { SongDetailsAttributes, SongDetailsCreationAttributes } from "src/types/songDetailsAttributes";

@Table({
    tableName: "song_details",
    underscored: true,
    timestamps: false
}) export class SongDetailsModel extends Model<SongDetailsAttributes, SongDetailsCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => SongsModel)
    @AllowNull(false)
    @Column(DataType.NUMBER)
    declare song_id: number;

    @BelongsTo(() => SongsModel)
    song: SongsModel;
    
    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare danceability: number;
    
    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare energy: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {
            min: 0,
            max: 11
        }
    })
    declare track_key: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: -60,
            max: 0
        }
    })
    declare loudness: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare mode: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare speechiness: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 6),
        validate: {
            min: 0,
            max: 1
        }
    })
    declare acousticness: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 6),
        validate: {
            min: 0,
            max: 1
        }
    })
    declare instrumentalness: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare liveness: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: {
            min: 0,
            max: 1
        }
    })
    declare valence: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(6, 3),
        validate: {
            min: 30,
            max: 300
        }
    })
    declare tempo: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {
            min: 1,
            max: 12
        }
    })
    declare time_signature: number;

    @Column({
        type: DataType.TSVECTOR,
    })
    declare vectors: number[];
}