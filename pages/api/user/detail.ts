import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAPI } from "lib/auth";
import { Detail } from "controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const auth = req.headers["authorization"];
  const user = await verifyAPI(auth);

  if (!user || !user?.email) {
    return res.status(401).json({ message: "User not found" });
  }

  switch (method) {
    case "GET":
      // @ts-ignore
      return await Detail.get(req, res, user.email);

    case "POST":
      // @ts-ignore
      return await Detail.create(req, res, user.email);

    case "PUT":
      return await Detail.update(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
