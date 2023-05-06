/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("medications").del();
  await knex("medications").insert([
    { name: "tylenol", dose: 200, doseUnit: "mg" },
    { name: "advil", dose: 300, doseUnit: "mg" },
    { name: "robitussin", dose: 400, doseUnit: "mg" },
  ]);
};
