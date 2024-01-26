require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "137.184.122.12",
      port: 5432,
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
    ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
  },
};
