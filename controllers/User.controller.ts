import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyUser } from "lib/auth";
import { TOKEN_SECRET } from "lib/constant";
import { jwtVerify } from "jose";

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

export const updateData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = req.headers.authorization;
    const token = auth && auth.split(" ")[1];
    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(TOKEN_SECRET)
    );

    const { email } = payload;
    console.log();

    if (!email) {
      throw new Error("");
    }

    const user = await prisma.user.update({
      where: {
        // @ts-ignore
        email,
      },
      data: { ...JSON.parse(req.body) },
    });
    if (user) {
      return res.status(200).json({ message: "ok" });
    } else {
      throw new Error("");
    }
  } catch (error) {
    return res.status(400).json({ message: "error updating" });
  }
};
