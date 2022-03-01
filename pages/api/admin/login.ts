import { SignJWT } from "jose";
import { TOKEN_SECRET } from "lib/constant";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid Method" });
  }

  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (admin && admin.password === password) {
      const token = await new SignJWT({
        email,
        admin: admin?.type,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(TOKEN_SECRET));

      const serialised = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialised);

      return res.status(200).json({ message: "Success!" });
    } else {
      return res.status(405).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    return res.status(405).json({ message: "Invalid credentials!" });
  }
}
