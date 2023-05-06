// var path = require("path");

// require("dotenv").config({ path: path.join(__dirname, "../.env") });

// console.dir(process.env);

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.NEXT_PUBLIC_DATABASE,
      user: process.env.NEXT_PUBLIC_USERNAME,
      password: process.env.NEXT_PUBLIC_PASSWORD,
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
