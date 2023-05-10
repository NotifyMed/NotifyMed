import type { NextApiRequest, NextApiResponse } from "next";
import knex from "@/src/knex/knex";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return handlePostMedication(req, res);
    case "GET":
      return getMedication(req, res);
    case "DELETE":
      return deleteMedication(req, res);
    case "PATCH":
      return updateMedication(req, res);
    default:
      return getMedication(req, res);
  }
}

function handlePostMedication(req: NextApiRequest, res: NextApiResponse) {
  switch (req.body.action) {
    case "ADD_MEDICATION":
      return addMedication(req, res);
    case "ADD_MEDICATION_LOG":
      return addMedicationLog(req, res);
  }
}

async function addMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medications")
      .insert({
        name: req.body.name,
        dose: req.body.dose,
        doseUnit: req.body.doseUnit,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function addMedicationLog(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medicationLog")
      .insert({
        medication_id: req.body.medicationId,
        dateTaken: req.body.date,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function getMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let id = req.query.id;
    let knexResponse = await knex("medications").modify((qb) => {
      id && qb.where({ id: id });
      qb.where({ isDeleted: false });
    });
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function updateMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medications")
      .where({ id: req.body.id })
      .update({ name: req.body.name })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function deleteMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medications")
      .where({ id: req.query.id })
      .update({ isDeleted: true })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}
