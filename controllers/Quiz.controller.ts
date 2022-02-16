import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyAPI } from "lib/auth";

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await prisma.question.findMany();
    return res.status(200).json({ data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to get news" });
  }
};

export const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { answer, question_id } = req.body;
    const auth = req.headers.authorization;
    // @ts-ignore
    const { email } = await verifyAPI(auth);
    if (!email) {
      throw new Error();
    }
    const data = await prisma.answer.create({
      data: {
        answer,
        user: {
          connect: {
            email,
          },
        },
        question: {
          connect: {
            id: question_id,
          },
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Unable to answer question" });
  }
};

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { title, text } = req.body;

    const data = await prisma.news.create({
      data: {
        title,
        text,
      },
    });
    return res.status(200).json({ data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to create news" });
  }
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, title, text } = req.body;
    const data = await prisma.news.update({
      where: {
        id,
      },
      data: {
        title,
        text,
      },
    });
    res.status(200).json({ data, message: "ok" });
  } catch (e) {
    res.status(400).json({ message: "Unable to update news" });
  }
};
