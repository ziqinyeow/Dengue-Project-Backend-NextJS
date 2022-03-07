import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    // update user group
    case "PUT":
      try {
        const { id, group, email, ic } = req.body;

        if (!group || !(group === "user" || group === "patient")) {
          throw new Error("");
        }
        const user = await prisma.user.update({
          where: {
            id,
          },
          data: {
            group,
          },
        });
        if (!user) {
          throw new Error("");
        }
        // switch from patient to user
        if (user.group === "user") {
          const patient = await prisma.patient.delete({
            where: {
              email,
            },
          });
          //   var date = new Date();
          //   var now_utc = Date.UTC(
          //     date.getUTCFullYear(),
          //     date.getUTCMonth(),
          //     date.getUTCDate(),
          //     date.getUTCHours() + 8,
          //     date.getUTCMinutes(),
          //     date.getUTCSeconds()
          //   );
          const history = await prisma.history.create({
            data: {
              ic: patient?.ic,
              email: patient?.email,
              start: patient?.start,
              end: new Date(),
              status: patient?.status ?? "",
              user: {
                connect: {
                  email: patient?.email,
                },
              },
            },
          });
        }
        // switch from user to patient
        else if (user.group === "patient") {
          await prisma.patient.create({
            data: {
              email,
              ic,
              user: {
                connect: {
                  id,
                },
              },
            },
          });
        }
        return res.status(200).json({ message: "Success updated" });
      } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "error" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
