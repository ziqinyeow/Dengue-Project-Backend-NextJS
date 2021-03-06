import type { NextApiRequest, NextApiResponse } from "next";
import { Quiz } from "controllers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  switch (method) {
    case "GET":
      return await Quiz.get(req, res);
    case "PATCH":
      return await Quiz.getScore(req, res);
    case "POST":
      return await Quiz.answer(req, res);
    case "PUT":
      return await Quiz.update(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
