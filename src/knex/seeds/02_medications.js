/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("medications").del();
  await knex("medications").insert([
    { user_id: 1, id: 1, name: "tylenol", dose: 200, doseUnit: "mg" },
    { user_id: 1, id: 2, name: "advil", dose: 300, doseUnit: "mg" },
    { user_id: 4, id: 3, name: "robitussin", dose: 400, doseUnit: "mg" },
    { user_id: 4, id: 4, name: "tylenol", dose: 400, doseUnit: "mg" },
  ]);
};
