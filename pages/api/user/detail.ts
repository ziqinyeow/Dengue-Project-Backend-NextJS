import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyUser } from "lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const auth = req.headers["authorization"];
  const user = await verifyUser(auth);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  switch (method) {
    case "GET":
      // @ts-ignore
      return res.status(200).json({ data: user?.detail });

    case "POST":
      return await create(req, res, user?.email);

    case "PUT":
      return await update(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

const create = async (
  req: NextApiRequest,
  res: NextApiResponse,
  email: string | null
) => {
  if (!email) {
    return res.status(404).json({ message: "User Not Found" });
  }
  try {
    const {
      temperature,
      blood_pressure,
      pulse_rate,
      hemoglobin,
      hematocrit,
      white_cell,
      platelet,
    } = req.body;

    const data = await prisma.detail.create({
      data: {
        temperature,
        blood_pressure,
        pulse_rate,
        hemoglobin,
        hematocrit,
        white_cell,
        platelet,
        user: {
          connect: {
            email,
          },
        },
      },
    });
    return res.status(200).json({ data, message: "ok" });
  } catch (error) {
    return res.status(400).json({ messsage: "Unable to create user detail" });
  }
};

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      id,
      temperature,
      blood_pressure,
      pulse_rate,
      hemoglobin,
      hematocrit,
      white_cell,
      platelet,
    } = req.body;
    const data = await prisma.detail.update({
      where: {
        id,
      },
      data: {
        temperature,
        blood_pressure,
        pulse_rate,
        hemoglobin,
        hematocrit,
        white_cell,
        platelet,
      },
    });
    res.status(200).json({ data, message: "ok" });
  } catch (e) {
    res.status(400).json({ message: "Unable to update user detail data" });
  }
};
