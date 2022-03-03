import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { email, password, type } = req.body;
        const admin = await prisma.admin.create({
          data: {
            email,
            password,
            type,
          },
        });
        if (admin) {
          return res.status(200).json({ message: "ok" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Email must be unique" });
      }

    case "PUT":
      try {
        const { id, type } = req.body;
        const admin = await prisma.admin.update({
          where: {
            id,
          },
          data: {
            type,
          },
        });
        if (admin) {
          return res.status(200).json({ message: "ok" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Error" });
      }

    case "DELETE":
      try {
        const { id } = req.body;
        await prisma.admin.delete({
          where: {
            id,
          },
        });
        return res.status(200).json({ message: "ok" });
      } catch (error) {
        return res.status(400).json({ message: "Error" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
