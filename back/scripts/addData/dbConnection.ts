import { Sequelize } from "sequelize";
import dotenv from "dotenv"; dotenv.config();

const DB_URL = process.env.LOCAL_DB_URL;

if (!DB_URL) {
    console.log(DB_URL)
    throw new Error("The url is not defined!");
};

export const sequelize = new Sequelize(DB_URL);

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to the DB!");
    } catch (err) {
        console.error("❌ Failed to connect to the DB");
        console.error(err);
        return process.exit(1);
    };

    return null;
};