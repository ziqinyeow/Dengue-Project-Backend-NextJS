import { verifyAPI } from "lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const auth = req.headers.authorization;
  const payload = await verifyAPI(auth);
  if (!payload?.ic || !payload.email) {
    return res.status(400).json({ message: "User not found" });
  }

  switch (method) {
    case "GET":
      try {
        const patient = await prisma.patient.findUnique({
          where: {
            // @ts-ignore
            ic: payload?.ic,
          },
        });
        if (!patient) {
          return res.status(404).json({ message: "Patient not found" });
        }

        // const dbNow = (): Date => dayjs().add(8, "hour").toDate();
        // const today = new Date(dbNow().setUTCHours(0, 0, 0, 0));
        // const tomorrow = new Date(dbNow().setUTCHours(24, 0, 0, 0));
        const start = new Date(patient?.start);
        const today = new Date();

        const difference = today.getTime() - start.getTime();
        const day = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
        const symptom = await prisma.symptom.findMany({
          where: {
            user: {
              // @ts-ignore
              ic: payload?.ic,
            },
            createdAt: {
              gte: patient?.start,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        });
        return res.status(200).json({
          symptom: symptom[0]?.status === "dangerous" ? true : false ?? null,
          day,
          message: "ok",
        });
      } catch (error) {
        return res.status(404).json({ message: "error", error });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
