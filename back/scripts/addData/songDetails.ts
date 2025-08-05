import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbConnection";
import { SongDetailsAttributes, SongDetailsCreationAttributes } from "../../src/types/songDetailsAttributes";

export class songDetails extends Model<SongDetailsAttributes, SongDetailsCreationAttributes> {}
songDetails.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "songs", key: "id" }
    },
    danceability: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    energy: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    track_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 11
        }
    },
    loudness: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -60,
            max: 0
        }
    },
    mode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    speechiness: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    acousticness: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    instrumentalness: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    liveness: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    valence: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    tempo: {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false,
        validate: {
            min: 30,
            max: 300
        }
    },
    time_signature: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12
        }
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "song_details"
})