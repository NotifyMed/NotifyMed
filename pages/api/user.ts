import type { NextApiRequest, NextApiResponse } from "next";
import knex from "@/src/knex/knex";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
    let id = req.query.id;
    let knexResponse = await knex("users")
      .modify((qb) => {
        id && qb.where({ id });
        qb.where({ isDeleted: false });
      })
      .select("id", "email", "phone");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("users")
      .where({ id: req.body.id })
      .update({ email: req.body.email, phone: req.body.phone })
      .returning("*");
    console.log(knexResponse);
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("users")
      .where({ id: req.query.id })
      .update({ isDeleted: true })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}
