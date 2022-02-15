import type { NextApiRequest, NextApiResponse } from "next";
import { News } from "controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  switch (method) {
    case "GET":
      return await News.get(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
