import { Sequelize } from "sequelize";

import { config } from "../config";

var sequelize = new Sequelize(
    config.db_name,
    config.db_user,
    config.db_password,
    {
        host: config.host,
        port: config.port,
        dialect: "postgres",
        omitNull: true,
        // logging : debug, //server.ServerConfig.LogLevel,
        pool: {
            max: 15,
            min: 0,
            idle: 5000,
            acquire: 200000,
        },
    }
);

export function Connect() {
    // connecting with server using sequelize
    var context = sequelize;
    // testing the connection
    context
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch((err) => {
            console.log(err);
        });
    return context;
}
