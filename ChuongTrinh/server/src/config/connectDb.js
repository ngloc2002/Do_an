import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "zywbevpm_doan",
    "zywbevpm_doan",
    "12345678",
    {
        host: "103.97.126.29",
        dialect: "mysql",
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
    }
);
// const sequelize = new Sequelize(
//   "ejbqqdes_nodejs",
//   "ejbqqdes_nodejs",
//   "12345678",
//   {
//     host: "103.97.126.24",
//     dialect: "mysql",
//     charset: "utf8mb4",
//     collate: "utf8mb4_unicode_ci",
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000,
//     },
//     port: 3306,
//   }
// );

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

export default connection;