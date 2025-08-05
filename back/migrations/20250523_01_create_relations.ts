import { DataTypes } from "sequelize"

export const up = async ({ context: queryInterface }) => {
    await queryInterface.createTable("song_artists_rp", {
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
        artist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "artists", key: "id" }
        }
    });

    await queryInterface.createTable("song_genres_rp", {
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
        genre_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "genres", key: "id" }
        },
    });
}

export const down = async ({ context: queryInterface }) => {
    await queryInterface.dropTable("song_artists_rp");
    await queryInterface.dropTable("song_genres_rp");
};