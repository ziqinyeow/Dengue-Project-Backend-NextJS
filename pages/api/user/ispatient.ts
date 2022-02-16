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
            ic: payload.ic,
          },
        });
        if (patient) {
          //   await prisma.user.update({
          //     where: {
          //       // @ts-ignore
          //       email: payload.email,
          //     },
          //     data: {
          //       group: 1,
          //     },
          //   });
          return res
            .status(200)
            .json({ verified: true, message: "Is a patient" });
        }
        return res
          .status(404)
          .json({ verified: false, message: "Is not a patient" });
      } catch (error) {
        return res
          .status(404)
          .json({ verified: false, message: "Is not a patient" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
