import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import knex from "@/src/knex/knex";

export default class MedicationController {
  static async AddMedication(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medications")
        .insert({
          name: capitalizeFirstLetter(data.name),
          dose: data.dose,
          doseUnit: data.doseUnit,
          user_id: data.userId,
        })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error adding mediciation");
      console.error(e);
      return null;
    }
  }
  static async GetMedication(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medications")
        .select("id", "user_id", "name", "dose", "doseUnit")
        .where((qb) => {
          data.id && qb.where("id", data.id);
          qb.where("isDeleted", false);
          qb.where("user_id", data.userId);
        });
      return knexResponse;
    } catch (e) {
      console.log("Error retrieving medication");
      console.error(e);
      return null;
    }
  }
  static async UpdateMedication(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medications")
        .where({ id: data.id })
        .update({ name: capitalizeFirstLetter(data.name) })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error updating medication");
      console.error(e);
      return null;
    }
  }
  static async DeleteMedication(data: any): Promise<any> {
    try {
      let knexResponse = await knex("medications")
        .where({ id: data.id })
        .update({ isDeleted: true })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error deleting medication");
      console.error(e);
      return null;
    }
  }
}
