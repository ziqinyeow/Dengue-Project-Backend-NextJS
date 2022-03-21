import { verifyAPI } from "lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const auth = req.headers["authorization"];
  const user = await verifyAPI(auth);

  if (!user || !user?.email || !user?.ic) {
    return res.status(401).json({ message: "User not found" });
  }

  switch (method) {
    case "POST":
      try {
        const { i, ii, iii } = req.body;
        const seek_help = await prisma.seek_help_form.create({
          data: {
            i,
            ii: new Date(ii),
            iii,
            user: {
              connect: {
                // @ts-ignore
                email: user?.email,
              },
            },
          },
        });
        const symptom = await prisma.symptom.findMany({
          where: {
            user: {
              // @ts-ignore
              ic: user?.ic,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        });
        const update = await prisma.symptom.update({
          where: {
            id: symptom[0]?.id,
          },
          data: {
            status: "normal",
          },
        });
        return res
          .status(200)
          .json({ form: seek_help, symptom: update, message: "ok" });
      } catch (error) {
        return res.status(404).json({ message: "error" });
      }
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
