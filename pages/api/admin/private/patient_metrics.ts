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
        const patient_who_seek_help = await prisma.patient.count({
          where: {
            seek_help: true,
          },
        });

        const patient_who_admitted = await prisma.patient.count({
          where: {
            status: "admitted",
          },
        });

        return res
          .status(200)
          .json({ patient_who_seek_help, patient_who_admitted });
      } catch (error) {
        return res.status(400).json({ message: "Unable to get data" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
