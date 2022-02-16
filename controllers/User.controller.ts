import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyUser } from "lib/auth";

export const getAllData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = req.headers.authorization;
    const user = await verifyUser(auth);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ data: user, message: "All data is retrieved" });
  } catch (error) {
    return res.status(400).json({ message: "User not found" });
  }
};
