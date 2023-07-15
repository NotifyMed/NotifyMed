/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function (knex) {
   // Deletes ALL existing entries
   await knex("medicationschedule").del();
   await knex("medicationschedule").insert([
     // { medication_id: 3, logWindowStart: "14:00:00", logWindowEnd: "20:30:00" },
     { medication_id: 4, logWindowStart: "14:00:00", logWindowEnd: "20:00:00" },
   ]);
 };
