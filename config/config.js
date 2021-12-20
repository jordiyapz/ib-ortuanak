require("dotenv").config();
const { DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
console.log(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_NAME)
module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: "mysql",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: "mysql",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: "mysql",
  },
};
