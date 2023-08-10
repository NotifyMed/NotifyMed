import type { NextApiRequest, NextApiResponse } from "next";
import UserController from "@/src/Controllers/UserController";

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
  const data = {
    ...req.body.user,
  };

  const newUser = await UserController.AddUser(data);
  if (newUser != null) return res.status(200).json(newUser);
  return res.status(400).json({ error: "Error adding user" });
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    ...req.body.user,
  };

  const user = await UserController.GetUser(data);
  if (user != null) return res.status(200).json(user);
  return res.status(400).json({ error: "Error retrieving user" });
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    ...req.body.user,
  };

  const updatedUser = await UserController.UpdateUser(data);

  if (updatedUser != null) return res.status(200).json(updatedUser);
  return res.status(400).json({ error: "Error updating user" });
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    ...req.body.user,
  };

  const deletedUser = await UserController.DeleteUser(data);

  if (deletedUser != null) return res.status(200).json(deletedUser);
  return res.status(400).json({ error: "Error deleting user" });
}
