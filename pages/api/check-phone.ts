import { NextApiRequest, NextApiResponse } from "next";
import knex from "@/src/knex/knex";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { phone } = req.body;

  try {
    // Query the database to check if the phone number exists
    const user = await knex("users").where("phone", phone).first();

    if (user) {
      // Phone number found in the users table
      return res.status(200).json({ exists: true, user });
    } else {
      // Phone number not found in the users table
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while checking the phone number." });
  }
}
