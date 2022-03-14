import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import dayjs from "dayjs";

export const get = async (
  req: NextApiRequest,
  res: NextApiResponse,
  email: string | null
) => {
  if (!email) {
    return res.status(404).json({ message: "User Not Found" });
  }
  try {
    const dbNow = (): Date => dayjs().add(8, "hour").toDate();
    const today = new Date(dbNow().setUTCHours(0, 0, 0, 0));
    const tomorrow = new Date(dbNow().setUTCHours(24, 0, 0, 0));

    const vital_sign_filled = await prisma.vital_sign.findMany({
      where: {
        user: {
          email,
        },
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const blood_profile_filled = await prisma.blood_profile.findMany({
      where: {
        user: {
          email,
        },
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const vital_sign = await prisma.vital_sign.findMany({
      where: {
        user: {
          email,
        },
      },
    });

    const blood_profile = await prisma.blood_profile.findMany({
      where: {
        user: {
          email,
        },
      },
    });

    return res.status(200).json({
      vital_sign_filled: vital_sign_filled.length,
      blood_profile_filled: blood_profile_filled.length,
      vital_sign,
      blood_profile,
      message: "ok",
    });
  } catch (error) {
    return res.status(400).json({ message: "error getting the data" });
  }
};
export const create = async (
  req: NextApiRequest,
  res: NextApiResponse,
  email: string | null
) => {
  if (!email) {
    return res.status(404).json({ message: "User Not Found" });
  }
  try {
    const {
      type, // vital_sign || blood_profile
      temperature,
      blood_pressure,
      pulse_rate,
      respiratory_rate,
      oxygen_saturation,
      haemoglobin,
      haematocrit,
      white_cell,
      platelet,
    } = req.body;

    if (!type || !(type === "vital_sign" || type === "blood_profile")) {
      throw new Error("");
    }

    const dbNow = (): Date => dayjs().add(8, "hour").toDate();
    const today = new Date(dbNow().setUTCHours(0, 0, 0, 0));
    const tomorrow = new Date(dbNow().setUTCHours(24, 0, 0, 0));
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate());
    // tomorrow.setHours(24, 0, 0, 0);

    if (type === "vital_sign") {
      const vital_sign = await prisma.vital_sign.findMany({
        where: {
          user: {
            email,
          },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      if (vital_sign.length >= 1) {
        return res
          .status(200)
          .json({ message: "You already filled the vital sign" });
      }
      const data = await prisma.vital_sign.create({
        data: {
          temperature,
          blood_pressure,
          pulse_rate,
          respiratory_rate,
          oxygen_saturation,
          createdAt: new Date(dbNow()),
          user: {
            connect: {
              email,
            },
          },
        },
      });
      return res.status(200).json({ data, message: "ok" });
    } else if (type === "blood_profile") {
      const blood_profile = await prisma.blood_profile.findMany({
        where: {
          user: {
            email,
          },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      if (blood_profile.length >= 1) {
        return res
          .status(200)
          .json({ message: "You already filled the vital sign" });
      }
      const data = await prisma.blood_profile.create({
        data: {
          haemoglobin,
          haematocrit,
          white_cell,
          platelet,
          createdAt: new Date(dbNow()),
          user: {
            connect: {
              email,
            },
          },
        },
      });
      return res.status(200).json({ data, message: "ok" });
    } else {
      return res.status(405).json({ message: "Invalid type" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Unable to create user detail" });
  }
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      id,
      type,
      temperature,
      blood_pressure,
      pulse_rate,
      respiratory_rate,
      oxygen_saturation,
      haemoglobin,
      haematocrit,
      white_cell,
      platelet,
    } = req.body;
    if (!type) {
      throw new Error("");
    }

    if (type === "vital_sign") {
      const data = await prisma.vital_sign.update({
        where: {
          id,
        },
        data: {
          temperature,
          blood_pressure,
          pulse_rate,
          respiratory_rate,
          oxygen_saturation,
        },
      });
      return res.status(200).json({ data, message: "ok" });
    } else if (type === "blood_profile") {
      const data = await prisma.blood_profile.update({
        where: {
          id,
        },
        data: {
          haemoglobin,
          haematocrit,
          white_cell,
          platelet,
        },
      });
      return res.status(200).json({ data, message: "ok" });
    } else {
      return res.status(405).json({ message: "Invalid type" });
    }
  } catch (e) {
    res.status(400).json({ message: "Unable to update user detail data" });
  }
};
