import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export const get = async (
  _req: NextApiRequest,
  res: NextApiResponse,
  email: string
) => {
  try {
    // const data = await prisma.symptom.findMany({
    //   where: {
    //     user: {
    //       email,
    //     },
    //   },
    // });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    tomorrow.setHours(24, 0, 0, 0);
    const symptom = await prisma.symptom.findMany({
      where: {
        user: {
          email,
        },
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    const number = symptom?.length ?? 0;
    return res.status(200).json({ number, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to get task" });
  }
};

export const create = async (
  req: NextApiRequest,
  res: NextApiResponse,
  email: string
) => {
  try {
    const { response } = req.body;

    // perform logic

    const data = await prisma.symptom.create({
      data: {
        response,
        user: {
          connect: {
            email,
          },
        },
      },
    });

    return res.status(200).json({ data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to create task" });
  }
};
