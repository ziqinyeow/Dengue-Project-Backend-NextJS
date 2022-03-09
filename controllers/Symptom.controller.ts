import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export const get = async (
  _req: NextApiRequest,
  res: NextApiResponse,
  email: string
) => {
  try {
    const data = await prisma.symptom.findMany({
      where: {
        user: {
          email,
        },
      },
    });
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
    return res.status(200).json({ data, number, message: "ok" });
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
    const arr = response.split(" ");
    // let risk_type = "";
    let indexes = 0;
    indexes += arr[1] === 1 ? 1 : 1; // fever
    indexes += arr[3] <= 3 || arr[3] >= 1 ? 1 : 2; // vomitting
    indexes += arr[5] <= 3 || arr[5] >= 1 ? 1 : 2; // diarrhoea
    indexes += arr[7] === 1 ? 2 : 1; // stomach pain
    indexes += arr[9] === 1 ? 2 : 1; // bleeding
    indexes += arr[11] === 1 ? 2 : 1; // difficulty breathing
    indexes += arr[13] === 1 ? 2 : 1; // fainting
    indexes += arr[15] === 1 ? 2 : 1; // tired
    indexes += arr[17] === 1 ? 2 : 1; // drowsy
    indexes += arr[19] === 1 ? 2 : 1; // reduced urine
    indexes += arr[21] === 1 ? 1 : 2; // reduced drinking

    const risk_value = indexes;
    const risk_status = risk_value > 11 ? "dangerous" : "normal";

    const data = await prisma.symptom.create({
      data: {
        response,
        status: risk_status,
        user: {
          connect: {
            email,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ risk_value, risk_status, data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to create task" });
  }
};
