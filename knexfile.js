require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.NEXT_DATABASE,
      user: process.env.NEXT_USER,
      password: process.env.NEXT_PASSWORD,
      host: process.env.NEXT_HOST,
      port: parseInt(process.env.NEXT_PORT),
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

console.log("Database:", process.env.NEXT_DATABASE);
console.log("User:", process.env.NEXT_USER);
console.log("Password:", process.env.NEXT_PASSWORD);
console.log("Host:", process.env.NEXT_HOST);
console.log("Port:", process.env.NEXT_PORT); 

