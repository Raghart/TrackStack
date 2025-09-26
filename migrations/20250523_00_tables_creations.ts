import { DataTypes } from "sequelize"

export const up = async ({ context: queryInterface }) => {
    await queryInterface.createTable("albums", {
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
            unique: true
        },
    });
    
    await queryInterface.createTable("songs", {
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
        spotify_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        url_preview: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
                max: 6
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1980,
                max: 2025
            }
        },
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "albums", key: "id" }
        },
    })

    await queryInterface.createTable("artists", {
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
    })

    await queryInterface.createTable("genres", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    })

    await queryInterface.createTable("song_details", {
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
    })
}

export const down = async ({ context: queryInterface }) => {
    await queryInterface.dropTable("songs");
    await queryInterface.dropTable("albums");
    await queryInterface.dropTable("artists");
    await queryInterface.dropTable("genres");
    await queryInterface.dropTable("song_details");
}