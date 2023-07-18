/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    { email: "email@gmail.com", password: "mypassword" },
    { email: "email@gmail2.com", password: "mypassword2" },
    { email: "email@gmail3.com", password: "mypassword3" },
    {
      name: "Alvin Quach",
      id: 4,
      email: "alvinwquach@gmail.com",
      phone: process.env.TWILIO_SECRET,
    },
  ]);
};
