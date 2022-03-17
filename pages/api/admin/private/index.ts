import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { TOKEN_SECRET } from "lib/constant";
import { jwtVerify } from "jose";

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
    difference += `${days} `;
  }

  difference += `${hours} ${minutes}`;

  return difference;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cookies } = req;
    const jwt = cookies.token;
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(TOKEN_SECRET)
    );

    const admin = await prisma.admin.findUnique({
      where: {
        // @ts-ignore
        email: payload?.email,
      },
      select: {
        email: true,
        type: true,
      },
    });
    console.log(admin);

    if (!admin) {
      throw new Error("");
    }
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        // detail: true,
        username: true,
        fullname: true,
        phone_no: true,
        group: true,
        ic: true,
        address: true,
        postcode: true,
        state: true,
        symptom: true,
      },
      orderBy: {
        group: "asc",
      },
    });
    const patient = await prisma.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        start: "asc",
      },
    });
    patient.map((p) => {
      const diff = time_diff(p?.start);
      // @ts-ignore
      p.diff = diff;
      return p;
    });
    if (admin.type === "admin") {
      return res
        .status(200)
        .json({ admin, user, patient, type: "admin", message: "ok" });
    }
    return res.status(200).json({
      admin,
      user,
      patient,
      type: "superuser",
      message: "ok",
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}
