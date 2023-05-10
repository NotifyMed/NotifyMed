// var path = require("path");

// require("dotenv").config({ path: path.join(__dirname, "../.env") });

// console.dir(process.env);

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "notifymed",
      user: "postgres",
      password: "postgres",
      // database: process.env.DATABASE,
      // user: process.env.USERNAME,
      // password: process.env.PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/knex/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/knex/seeds",
    },
  },
};
