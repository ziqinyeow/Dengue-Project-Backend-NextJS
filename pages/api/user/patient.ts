import { verifyAPI } from "lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

function time_diff(dateFuture: Date) {
  const now = new Date();
  // @ts-ignore
  let diffInMilliSeconds = Math.abs(dateFuture - now) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log("calculated days", days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // console.log("calculated hours", hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log("minutes", minutes);

  let difference = "";
  if (days > 0) {
    difference += `${days} ${days > 1 ? "days" : "day"} `;
  } else {
    difference += `0 day `;
  }

  difference += `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} ${
    minutes > 1 ? "minutes" : "minute"
  }`;

  return difference;
}

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
        // const start = new Date(patient?.start);
        // const today = new Date();

        // const difference = today.getTime() - start.getTime();
        // const day = Math.ceil(difference / (1000 * 3600 * 24)) + 1;

        const day = time_diff(new Date(patient?.start));
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
