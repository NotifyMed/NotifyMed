import knex from "@/src/knex/knex";

export default class MedicationLogController {
  static async AddMedicationLog(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medicationLog")
        .insert({
          medication_id: data.medicationId,
          dateTaken: data.date,
          user_id: data.userId,
        })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log(e);
      console.log("Error adding mediciation log");
      console.error(e);
      return null;
    }
  }
  static async GetMedicationLog(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medicationLog")
        .select("id", "medication_id", "dateTaken")
        .where((qb) => {
          data.medicationId && qb.where("medication_id", data.medicationId);
          qb.where("user_id", data.userId);
        });
      return knexResponse;
    } catch (e) {
      console.log("Error retrieving medication log");
      console.error(e);
      return null;
    }
  }
}
