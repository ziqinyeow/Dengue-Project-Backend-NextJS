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
        const { email, phone_no } = req.body;

        if (!email || !phone_no) {
          throw new Error("");
        }

        const user = await prisma.user.findUnique({
          where: {
            phone_no,
          },
        });

        if (user) {
          await prisma.patient.create({
            data: {
              email,
              phone_no,
              user: {
                connect: {
                  phone_no,
                },
              },
            },
          });
          await prisma.user.update({
            where: {
              phone_no,
            },
            data: {
              group: "patient",
            },
          });
        } else {
          await prisma.patient.create({
            data: {
              email,
              phone_no,
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
