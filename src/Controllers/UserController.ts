import knex from "@/src/knex/knex";

export default class UserController {
  static async AddUser(data: any): Promise<any> {
    try {
      let knexResponse = await knex("users")
        .insert({
          email: data.email,
          password: data.password,
          phone: data.phone,
        })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error adding user");
      console.error(e);
      return null;
    }
  }
  static async GetUser(data: any): Promise<any> {
    try {
      let email = data.email;
      let knexResponse = await knex("users")
        .modify((qb) => {
          email && qb.where({ email });
          qb.where({ isDeleted: false });
        })
        .select("id", "email", "phone")
        .first();
      return knexResponse;
    } catch (e) {
      console.log("Error retrieving user");
      console.error(e);
      return null;
    }
  }
  static async UpdateUser(data: any): Promise<any> {
    try {
      let knexResponse = await knex("users")
        .where({ email: data.email })
        .update({ phone: data.phone })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error updating user");
      console.error(e);
      return null;
    }
  }
  static async DeleteUser(data: any): Promise<any> {
    try {
      let knexResponse = await knex("users")
        .where({ email: data.email })
        .update({ isDeleted: true })
        .returning("*");
      return knexResponse;
    } catch (e) {
      console.log("Error deleting user");
      console.error(e);
      return null;
    }
  }
}
