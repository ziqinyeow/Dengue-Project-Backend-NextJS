import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { TOKEN_SECRET } from "lib/constant";
import { jwtVerify } from "jose";

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
    });
    if (!admin) {
      throw new Error("");
    }
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        detail: true,
        username: true,
        fullname: true,
        phone_no: true,
        group: true,
        ic: true,
        address: true,
        postcode: true,
        state: true,
      },
    });
    const detail = await prisma.detail.findMany({});
    if (admin.type === "admin") {
      return res
        .status(200)
        .json({ user, detail, type: "admin", message: "ok" });
    }
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        type: true,
      },
    });
    return res
      .status(200)
      .json({ admin: admins, user, detail, type: "superuser", message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}
