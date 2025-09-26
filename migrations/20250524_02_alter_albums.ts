import { DataTypes } from "sequelize"

export const up = async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("albums", "url_image", {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    })
}

export const down = async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("albums", "url_image", {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    })
}