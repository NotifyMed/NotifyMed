require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "notifymed",
      user: "postgres",
      password: "postgres",
      host: "137.184.122.12",
      port: 5432,
      ssl: true,
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
