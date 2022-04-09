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

export const getScore = async (req: NextApiRequest, res: NextApiResponse) => {
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
    });

    // const module_1 = data.filter((d) => d.module === 1);
    // const module_2 = data.filter((d) => d.module === 2);
    // const module_3 = data.filter((d) => d.module === 3);
    // const module_4 = data.filter((d) => d.module === 4);
    // const module_5 = data.filter((d) => d.module === 5);
    // const module_6 = data.filter((d) => d.module === 6);
    // const module_7 = data.filter((d) => d.module === 7);

    let module_1 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 1)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_2 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 2)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_3 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 3)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_4 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 4)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_5 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 5)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_6 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 6)
        .map(function (m) {
          return m.no_correct;
        })
    );
    let module_7 = Math.max.apply(
      Math,
      // @ts-ignore
      data
        .filter((d) => d.module === 7)
        .map(function (m) {
          return m.no_correct;
        })
    );
    // module_1 = module_1 === null ? 0 : module_1;
    // module_2 = module_2 === null ? 0 : module_2;
    // module_3 = module_3 === null ? 0 : module_3;
    // module_4 = module_4 === null ? 0 : module_4;
    // module_5 = module_5 === null ? 0 : module_5;
    // module_6 = module_6 === null ? 0 : module_6;
    // module_7 = module_7 === null ? 0 : module_7;

    const total_correct =
      ((module_1 +
        module_2 +
        module_3 +
        module_4 +
        module_5 +
        module_6 +
        module_7) /
        50) *
      100;

    return res.status(200).json({
      no_correct: {
        module_1,
        module_2,
        module_3,
        module_4,
        module_5,
        module_6,
        module_7,
      },
      total_correct,
      message: "ok",
    });
  } catch (error) {
    return res.status(400).json({ first_time: true, message: "No answer yet" });
  }
};

export const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { answer, no_correct } = req.body;
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
        no_correct: Number(no_correct),
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
    const { answer, no_correct } = req.body;
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
        no_correct: Number(no_correct),
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
