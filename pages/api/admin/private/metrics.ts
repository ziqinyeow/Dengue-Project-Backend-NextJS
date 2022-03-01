import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const user = await prisma.user.findMany();
        const total_user = user.length;

        const patient = await prisma.patient.findMany();
        const total_patient = patient.length;

        const detail = await prisma.detail.findMany();
        const total_detail = detail.length;

        return res
          .status(200)
          .json({ total_user, total_patient, total_detail });
      } catch (error) {
        return res.status(400).json({ message: "Unable to get data" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
