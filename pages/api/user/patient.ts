import { verifyAPI } from "lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

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
        const start = new Date(patient?.start);
        const today = new Date();
        const difference = start.getTime() - today.getTime();
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
            createdAt: "asc",
          },
        });
        return res.status(200).json({
          symptom:
            symptom[symptom?.length - 1].status === "dangerous"
              ? true
              : false ?? null,
          day,
          message: "ok",
        });
      } catch (error) {
        return res
          .status(404)
          .json({ verified: false, message: "Is not a patient" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
