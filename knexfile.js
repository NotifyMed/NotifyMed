require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 0,
      max: 95,
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
