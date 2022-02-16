import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/auth";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    type,
    email,
    password,
    fullname,
    username,
    ic,
    phone_no,
    address,
    postcode,
  } = req.body;

  switch (type) {
    case "signup":
      const token = await generateToken(ic, email);
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password,
            token,
            fullname,
            username,
            ic,
            phone_no,
            address,
            postcode,
          },
        });

        return res
          .status(200)
          .json({ verified: true, token: user?.token, message: "ok" });
      } catch (e) {
        return res.status(400).json({ message: "User created previously" });
      }

    case "login":
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (user?.password === password) {
          return res.status(200).json({
            verified: true,
            token: user?.token,
            message: "User login successfully",
          });
        }

        return res
          .status(200)
          .json({ verified: false, message: "User login unsuccessfully" });
      } catch (e) {
        return res.status(404).json({ message: "User has not sign up yet" });
      }

    default:
      return res.status(405).json({ message: "Type not allowed" });
  }
}
