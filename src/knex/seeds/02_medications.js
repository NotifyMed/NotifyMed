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
    { user_id: 4, id: 4, name: "codeine", dose: 400, doseUnit: "mg" },
    { user_id: 4, id: 5, name: "zyrtec", dose: 400, doseUnit: "mg" },
    { user_id: 4, id: 6, name: "nyquil", dose: 400, doseUnit: "mg" },
    { user_id: 4, id: 7, name: "dayquil", dose: 400, doseUnit: "mg" },
    { user_id: 4, id: 8, name: "benadryl", dose: 400, doseUnit: "mg" },
  ]);
};
