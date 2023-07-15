import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import knex from "@/src/knex/knex";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "next-auth/react";
import { capitalizeFirstLetter } from "../account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(403).json({ error: "Permission denied" });
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
    case "ADD_MEDICATION_SCHEDULE":
      return addMedicationSchedule(req, res);
  }
}

async function addMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medications")
      .insert({
        name: capitalizeFirstLetter(req.body.name),
        dose: req.body.dose,
        doseUnit: req.body.doseUnit,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function updateMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    let knexResponse = await knex("medications")
      .where({ id: req.body.id })
      .update({ name: capitalizeFirstLetter(req.body.name) })
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

async function addMedicationSchedule(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let knexResponse = await knex("medicationschedule")
      .insert({
        medication_id: req.body.medication_id,
        logWindowStart: req.body.logWindowStart,
        logWindowEnd: req.body.logWindowEnd,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

async function getMedication(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(403).json({ error: "Permission denied" });
    }

    //@ts-ignore
    const userId = session.user.userId;

    let id = req.query.id;
    let knexResponse = await knex("medications").modify((qb) => {
      id && qb.where({ id: id });
      qb.where({ isDeleted: false, user_id: userId }); // Add condition to filter by user_id
    });

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