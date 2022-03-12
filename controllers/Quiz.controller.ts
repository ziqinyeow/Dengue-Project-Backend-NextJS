import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyAPI } from "lib/auth";

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = req.headers.authorization;
    // @ts-ignore
    const { email } = await verifyAPI(auth);
    if (!email) {
      throw new Error();
    }
    const data = await prisma.answer.findMany({
      where: {
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
    const completed = data[0]?.answer?.length === 41;
    return res.status(200).json({ data, completed, message: "ok" });
  } catch (error) {
    return res.status(400).json({ first_time: true, message: "No answer yet" });
  }
};

export const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { answer } = req.body;
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
      },
    });
    return res.status(200).json({ data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: "Unable to answer question" });
  }
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, answer } = req.body;
    const data = await prisma.answer.update({
      where: {
        id,
      },
      data: {
        answer,
      },
    });
    res.status(200).json({ data, message: "ok" });
  } catch (e) {
    res.status(400).json({ message: "Unable to update news" });
  }
};
