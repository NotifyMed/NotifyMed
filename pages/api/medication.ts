import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import knex from "@/src/knex/knex";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "next-auth/react";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

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
    case "ADD_MEDICATION_WITH_SCHEDULE":
      return addMedicationSchedule(req, res);
  }
}

function handleGetMedication(req: NextApiRequest, res: NextApiResponse) {
  switch (req.body.action) {
    case "GET_MEDICATION_SCHEDULE":
      return getMedicationSchedule(req, res);
    default:
      return getMedication(req, res);
  }
}

async function addMedication(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  try {
    let knexResponse = await knex("medications")
      .insert({
        name: capitalizeFirstLetter(req.body.medication.name),
        dose: req.body.medication.dose,
        doseUnit: req.body.medication.doseUnit,
        user_id: session?.user?.userId,
      })
      .returning("*");
    return res.status(200).json(knexResponse);
  } catch (e) {
    console.log(e);
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
  const { medication, logWindowStart, logWindowEnd, userId } = req.body;

  try {
    let medicationResponse = await knex("medications")
      .insert({
        name: capitalizeFirstLetter(medication.name),
        dose: medication.dose,
        doseUnit: medication.doseUnit,
        user_id: userId,
      })
      .returning("*");

    const medicationId = medicationResponse[0].id;

    let scheduleResponse = await knex("medicationschedule")
      .insert({
        user_id: userId,
        medication_id: medicationId,
        logWindowStart: logWindowStart,
        logWindowEnd: logWindowEnd,
      })
      .returning("*");

    console.log(res);
    return res.status(200).json({
      medication: medicationResponse[0],
      schedule: scheduleResponse[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }
}

async function getMedicationSchedule(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const userId = session?.user?.userId;

    let id = req.query.id;
    let knexResponse = await knex("medications as medications")
      .join(
        "medicationschedule",
        "medications.id",
        "medicationschedule.medication_id"
      )
      .select(
        "medications.id",
        "medications.user_id",
        "medications.name",
        "medications.dose",
        "medications.doseUnit",
        "medicationschedule.logWindowStart",
        "medicationschedule.logWindowEnd"
      )
      .where((qb) => {
        id && qb.where("medications.id", id);
        qb.where("medications.isDeleted", false);
        qb.where("medications.user_id", userId);
      });
    console.log(knexResponse);

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

    const userId = session?.user?.userId;

    let id = req.query.id;
    let knexResponse = await knex("medications")
      .select("id", "user_id", "name", "dose", "doseUnit")
      .where((qb) => {
        id && qb.where("id", id);
        qb.where("isDeleted", false);
        qb.where("user_id", userId);
      });
    console.log(knexResponse);

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