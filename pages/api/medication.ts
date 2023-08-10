import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import knex from "@/src/knex/knex";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "next-auth/react";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import MedicationController from "@/src/Controllers/MedicationController";
import MedicationLogController from "@/src/Controllers/MedicationLogController";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(403).json({ error: "Permission denied" });
  switch (req.method) {
    case "PUT":
      return handlePutMedication(req, res);
    case "GET":
      return handleGetMedication(req, res);
    case "DELETE":
      return deleteMedication(req, res);
    case "PATCH":
      return updateMedication(req, res);
    default:
      return handleGetMedication(req, res);
  }
}

function handlePutMedication(req: NextApiRequest, res: NextApiResponse) {
  switch (req.body.action) {
    case "ADD_MEDICATION":
      return addMedication(req, res);
    case "ADD_MEDICATION_LOG":
      return addMedicationLog(req, res);
    case "ADD_MEDICATION_WITH_SCHEDULE":
      return addMedicationSchedule(req, res);
  }
}

async function handleGetMedication(req: NextApiRequest, res: NextApiResponse) {
  switch (req.query.action) {
    case "GET_MEDICATION_SCHEDULE":
      return getMedicationSchedule(req, res);
    case "GET_MEDICATION_LOG":
      return getMedicationLog(req, res);
    default:
      return getMedication(req, res);
  }
}

async function addMedication(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.userId;

  const data = {
    ...req.body.medication,
    userId,
  };

  const newMedication = await MedicationController.AddMedication(data);

  if (newMedication != null) return res.status(200).json(newMedication);
  return res.status(400).json({ error: "Error adding medication" });
}

async function updateMedication(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.userId;

  const data = {
    ...req.body.medication,
    userId,
  };

  const updatedMedication = await MedicationController.UpdateMedication(data);

  if (updatedMedication == null) {
    return res.status(400).json({ error: "Error updating medication" });
  }

  return res.status(200).json(updatedMedication);
}

async function addMedicationLog(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.userId;

  const data = {
    ...req.body.medication,
    userId,
  };

  const newMedicationLog = await MedicationLogController.AddMedicationLog(data);

  if (newMedicationLog != null) return res.status(200).json(newMedicationLog);
  return res.status(400).json({ error: "Error adding medication" });
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
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).json({ error: "Permission denied" });
  }

  const userId = session?.user?.userId;

  const data = {
    ...req.body,
    userId,
  };

  const medication = await MedicationController.GetMedication(data);

  if (medication == null) {
    return res.status(400).json({ error: "Error retrieving medication" });
  }

  return res.status(200).json(medication);
}

async function getMedicationLog(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.userId;

  const data = {
    ...req.body.medication,
    userId,
  };

  const medicationLog = await MedicationLogController.GetMedicationLog(data);

  if (medicationLog != null) return res.status(200).json(medicationLog);
  return res.status(400).json({ error: "Error adding medication" });
}

async function deleteMedication(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  const userId = session?.user?.userId;

  const data = {
    ...req.body.medication,
    userId,
  };

  const deletedMedication = await MedicationController.DeleteMedication(data);

  if (deleteMedication != null) return res.status(200).json(deletedMedication);
  return res.status(400).json({ error: "Error deleting medication" });
}