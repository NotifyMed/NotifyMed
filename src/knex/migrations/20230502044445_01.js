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
      table.text("name");
      table.text("password");
      table.string("image");
      table.boolean("isDeleted").defaultTo(false);
      table.timestamps(true, true, true);
    }),
    knex.schema.createTable("medications", (table) => {
      table.increments("id").primary();
      table.integer("user_id").references("id").inTable("users");
      table.text("name").notNullable();
      table.integer("dose").notNullable();
      table.text("doseUnit").notNullable();
      table.boolean("isDeleted").defaultTo(false);
      table.timestamps(true, true, true);
    }),
    knex.schema.createTable("medicationLog", (table) => {
      table.increments("id").primary();
      table.integer("medication_id").references("id").inTable("medications");
      table.timestamp("dateTaken").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("medicationSchedule", (table) => {
      table.increments("id").primary();
      table.integer("medication_id").references("id").inTable("medications");
      table.time("logWindowStart").notNullable;
      table.time("logWindowEnd").notNullable;
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
    knex.schema.dropTableIfExists("medicationSchedule"),
    knex.schema.dropTableIfExists("medicationLog"),
    knex.schema.dropTableIfExists("medications"),
    knex.schema.dropTableIfExists("users"),
  ]);
};
