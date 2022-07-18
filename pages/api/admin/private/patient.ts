import { NextApiRequest, NextApiResponse } from "next";
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
    difference += `${days + 1} `;
  }

  // difference += `${hours} ${minutes}`;

  return difference;
}

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

    case "PUT":
      try {
        const { patient_id, start, diff } = req.body;

        if (!patient_id || !diff) {
          throw new Error("");
        }

        let newDate = new Date(start);
        newDate.setDate(newDate.getDate() - -diff);

        const patient = await prisma.patient.update({
          where: {
            id: patient_id,
          },
          data: {
            start: newDate,
          },
        });

        return res.status(200).json({ message: "Success updated" });
      } catch (error) {
        return res.status(400).json({ message: "error" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
