// INSERT tables
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.text("email").notNullable();
      table.text("password").notNullable();
      table.boolean("isDeleted").defaultTo(false);
      table.timestamps(true, true, true);
    }),
    knex.schema.createTable("medications", (table) => {
      table.increments("id").primary();
      table.text("name").notNullable();
      table.integer("dose").notNullable();
      table.text("doseUnit").notNullable();
      table.boolean("isDeleted").defaultTo(false);
      table.timestamps(true, true, true);
    }),
  ]);
};

// DROP tables
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists("users"),
    knex.schema.dropTableIfExists("medications"),
  ]);
};
