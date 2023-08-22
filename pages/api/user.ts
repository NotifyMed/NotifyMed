import type { NextApiRequest, NextApiResponse } from "next";
import knex from "@/src/knex/knex";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      addUser(req, res);
      break;
    case "GET":
      getUser(req, res);
      break;
    case "DELETE":
      deleteUser(req, res);
      break;
    case "PATCH":
      updateUser(req, res);
      break;
    default:
      getUser(req, res);
      break;
  }
}

async function addUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("users")
      .insert({
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let email = req.query.email;
    let knexResponse = await knex("users")
      .modify((qb) => {
        email && qb.where({ email });
        qb.where({ isDeleted: false });
      })
      .select("id", "email", "phone")
      .first();
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    await knex("users")
      .where({ email: req.body.email })
      .update({ phone: req.body.phone })
      .returning("*");
    return res

      .status(200)
      .json({ message: "Phone number updated successfully" });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("users")
      .where({ email: req.query.email })
      .update({ isDeleted: true })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}
