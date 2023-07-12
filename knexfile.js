module.exports = {
  development: {
    client: "postgresql",
    connection: {
      // database: process.env.DATABASE,
      // user: process.env.USERNAME,
      // password: process.env.PASSWORD,
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
    seeds: {
      directory: "./src/knex/seeds",
    },
  },
};
