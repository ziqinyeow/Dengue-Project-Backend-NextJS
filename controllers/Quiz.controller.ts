import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyAPI } from "lib/auth";
import dayjs from "dayjs";

const module_question = [15, 6, 6, 7, 7, 5, 4];

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = req.headers.authorization;
    const { module } = req.query;
    // @ts-ignore
    const { email } = await verifyAPI(auth);
    if (!email) {
      throw new Error();
    }
    const data = await prisma.answer.findMany({
      where: {
        module: Number(module),
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    const completed = data[0]?.module
      ? data[0]?.answer?.split(" ").length ===
        module_question[data[0]?.module - 1]
      : false;
    return res.status(200).json({
      data: data[0] ?? data,
      module,
      total_completed: data[0]?.answer?.split(" ").length,
      completed,
      message: "ok",
    });
  } catch (error) {
    return res.status(400).json({ first_time: true, message: "No answer yet" });
  }
};

export const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { answer } = req.body;
    const { module } = req.query;
    const auth = req.headers.authorization;
    // @ts-ignore
    const { email } = await verifyAPI(auth);

    if (!email && !module) {
      throw new Error();
    }

    const dbNow = (): Date => dayjs().add(8, "hour").toDate();
    const data = await prisma.answer.create({
      data: {
        module: Number(module),
        answer,
        createdAt: new Date(dbNow()),
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
    const { answer } = req.body;
    const { module } = req.query;
    const auth = req.headers.authorization;
    // @ts-ignore
    const { email } = await verifyAPI(auth);

    if (!email && !module) {
      throw new Error();
    }

    const latest = await prisma.answer.findMany({
      where: {
        module: Number(module),
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    const completed = latest[0]?.module
      ? latest[0]?.answer?.length === module_question[latest[0]?.module - 1]
      : false;

    if (completed) {
      return res
        .status(200)
        .json({ data: latest, message: "Already completed" });
    }

    const data = await prisma.answer.update({
      where: {
        id: latest[0]?.id,
      },
      data: {
        answer,
      },
    });
    return res.status(200).json({ data, message: "ok" });
  } catch (e) {
    return res.status(400).json({ message: "Unable to update news" });
  }
};
