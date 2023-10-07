require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.NEXT_DATABASE,
      user: process.env.NEXT_USER,
      password: process.env.NEXT_PASSWORD,
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
