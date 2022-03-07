import type { NextApiRequest, NextApiResponse } from "next";
import { Symptom } from "controllers";
import { verifyUser } from "lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const auth = req.headers["authorization"];
  const user = await verifyUser(auth);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  switch (method) {
    case "GET":
      return await Symptom.get(req, res, user?.email);
    case "POST":
      return await Symptom.create(req, res, user?.email);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
