const { parse } = require("pg-connection-string"); // Import the pg-connection-string package

import Knex from "knex";
import knexConfig from "../../knexfile";
export default Knex(knexConfig.development);
