import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  switch (method) {
    case "GET":
      return await User.getAllData(req, res);
    case "PUT":
      return await User.updateData(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
