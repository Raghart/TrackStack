import { sequelize } from "../addData/dbConnection";
import { Umzug, SequelizeStorage } from "umzug";

const migrationConf = {
    migrations: {
        glob: "migrations/*.ts"
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console
};

export const runMigrations = async () => {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();

    console.log("Migrations up to date", { files: migrations.map((mig)=> mig.name) });
};

export const rollbackMigration = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
};