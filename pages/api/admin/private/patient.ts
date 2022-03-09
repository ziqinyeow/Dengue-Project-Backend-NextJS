import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    // create patient and link to their account
    // if patient no account, kiv for patient to signup
    case "POST":
      try {
        const { email, ic } = req.body;

        if (!email || !ic) {
          throw new Error("");
        }

        const user = await prisma.user.findUnique({
          where: {
            ic,
          },
        });

        if (user) {
          await prisma.patient.create({
            data: {
              email,
              ic,
              user: {
                connect: {
                  ic,
                },
              },
            },
          });
          await prisma.user.update({
            where: {
              ic,
            },
            data: {
              group: "patient",
            },
          });
        } else {
          await prisma.patient.create({
            data: {
              email,
              ic,
            },
          });
        }
        return res.status(200).json({ message: "Success updated" });
      } catch (error) {
        return res.status(400).json({ message: "error" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
