require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "137.184.122.12",
      port: 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/knex/migrations",
      tableName: "knex_migrations",
    },
  },
};
