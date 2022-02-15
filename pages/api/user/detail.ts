import type { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "lib/auth";
import { Detail } from "controllers";

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
      // @ts-ignore
      return res.status(200).json({ data: user?.detail });

    case "POST":
      return await Detail.create(req, res, user?.email);

    case "PUT":
      return await Detail.update(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
