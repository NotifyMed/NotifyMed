import { NextApiRequest, NextApiResponse } from "next";
import client from "../../twilio-client";
import knex from "@/src/knex/knex";
import { getSession } from "next-auth/react";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

export default async function sendReminder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentTime = new Date();

  try {
    // Fetch all medication schedules
    const session = await getSession({ req });

    const userId = session?.user?.userId;

    // Get the medication schedule associated with the user
    const medicationSchedules = await knex("medicationschedule")
      .where("user_id", userId)
      .select();

    // Iterate over each medication schedule
    for (const schedule of medicationSchedules) {
      const logWindowStart = parseTimeString(schedule.logWindowStart);
      const logWindowEnd = parseTimeString(schedule.logWindowEnd);

      // Check if the current time is within the log window
      if (currentTime >= logWindowStart && currentTime <= logWindowEnd) {
        res.json({
          success: false,
          message: "Reminder message should not be sent within the log window.",
        });
        // Stop execution of the function if within the log window
        return;
      }

      // Get the medication associated with the schedule
      const medication = await knex("medications")
        .where("id", schedule.medication_id)
        .first();

      // Get the user associated with the medication, including the phone number
      const user = await knex("users")
        .where("id", medication.user_id)
        .select("name", "phone")
        .first();

      await client.messages.create({
        body: `Hi ${
          user.name
        }, we've seen that you haven't taken your ${capitalizeFirstLetter(
          medication.name
        )} yet. This is a text reminder from Notify Med.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      });
    }

    res.json({
      success: true,
      message: "Reminder message sent successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to send the reminder messages.",
    });
  }
}

function parseTimeString(timeString: any) {
  const [hours, minutes, seconds] = timeString.split(":");
  const currentTime = new Date();
  currentTime.setHours(hours);
  currentTime.setMinutes(minutes);
  currentTime.setSeconds(seconds);
  return currentTime;
}