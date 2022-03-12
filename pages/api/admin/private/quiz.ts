import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { id, question, answer_scheme, explanation } = req.body;

  switch (method) {
    case "GET":
      try {
        // const quiz = await prisma.question.findMany({
        //   include: {
        //     answer: true,
        //   },
        // });
        // return res.status(200).json({ quiz, message: "ok" });
      } catch (error) {
        return res.status(400).json({ message: "Unable to get quiz data" });
      }

    case "POST":
      try {
        // const q = await prisma.question.create({
        //   data: {
        //     question,
        //     answer_scheme,
        //     explanation,
        //   },
        // });
        // if (q) {
        //   return res.status(200).json({ question: q, message: "ok" });
        // } else {
        //   throw new Error();
        // }
      } catch (error) {
        return res.status(400).json({ message: "Unable to create question" });
      }

    case "PUT":
      try {
        // const q = await prisma.question.update({
        //   where: {
        //     id,
        //   },
        //   data: {
        //     question,
        //     answer_scheme,
        //     explanation,
        //   },
        // });
        // if (q) {
        //   return res.status(200).json({ question: q, message: "ok" });
        // } else {
        //   throw new Error();
        // }
      } catch (error) {
        return res.status(400).json({ message: "Unable to update question" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
