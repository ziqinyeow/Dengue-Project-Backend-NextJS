import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import dayjs from "dayjs";
import { verifyAPI } from "lib/auth";

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
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate());
    // tomorrow.setHours(24, 0, 0, 0);
    const dbNow = (): Date => dayjs().add(8, "hour").toDate();
    const today = new Date(dbNow().setUTCHours(0, 0, 0, 0));
    const tomorrow = new Date(dbNow().setUTCHours(24, 0, 0, 0));
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
    const auth = req.headers.authorization;
    // @ts-ignore
    const { email } = await verifyAPI(auth);
    if (!email) {
      throw new Error();
    }
    const { response } = req.body;
    const dbNow = (): Date => dayjs().add(8, "hour").toDate();

    // perform logic
    const arr = response.split(" ");
    // 1 1 2 1 3 1 4 2 5 2 6 2 7 2 8 2 9 2 10 2 11 1
    // let risk_type = "";
    let indexes = 0;
    indexes += 1; // fever 1
    indexes += Number(arr[3]) <= 3 && Number(arr[3]) >= 1 ? 1 : 2; // vomitting 2
    indexes += Number(arr[5]) <= 3 && Number(arr[5]) >= 1 ? 1 : 2; // diarrhoea 3
    indexes += arr[7] === "1" ? 2 : 1; // stomach pain 4
    indexes += arr[9] === "1" ? 2 : 1; // bleeding 5
    indexes += arr[11] === "1" ? 2 : 1; // difficulty breathing 6
    indexes += arr[13] === "1" ? 2 : 1; // fainting 7
    indexes += arr[15] === "1" ? 2 : 1; // tired 8
    indexes += arr[17] === "1" ? 2 : 1; // drowsy 9
    indexes += arr[19] === "1" ? 2 : 1; // reduced urine 10
    indexes += arr[21] === "2" ? 2 : 1; // reduced drinking 11

    const risk_value = indexes;
    const risk_status = risk_value > 11 ? "dangerous" : "normal";

    const data = await prisma.symptom.create({
      data: {
        response,
        status: risk_status,
        createdAt: new Date(dbNow()),
        user: {
          connect: {
            email,
          },
        },
      },
    });

    const patient = await prisma.patient.findUnique({
      where: {
        email,
      },
    });

    if (patient?.status && patient?.status?.split(", ")?.length > 1) {
      await prisma.patient.update({
        where: {
          id: patient?.id,
        },
        data: {
          status: patient?.status + ", warning",
        },
      });
    }

    return res
      .status(200)
      .json({ risk_value, risk_status, data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to create symptom" });
  }
};
