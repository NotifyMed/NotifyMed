require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "notifymed",
      user: "postgres",
      password: "postgres",
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
