import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { verifyUser } from "lib/auth";
import { TOKEN_SECRET } from "lib/constant";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

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

export const resetPassword = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { old_pwd, new_pwd } = req.body;
    if (!old_pwd || !new_pwd || old_pwd === new_pwd) {
      return res.status(400).json({ message: "Invalid credential" });
    }
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

    if (!email) {
      throw new Error("");
    }

    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        email,
      },
    });

    if (user && (await bcrypt.compare(old_pwd, user.password))) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_pwd, salt);
      const u = await prisma.user.update({
        where: {
          // @ts-ignore
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
      if (u) {
        return res.status(200).json({ message: "ok" });
      } else {
        throw new Error("");
      }
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: "error updating" });
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

    if (!email) {
      throw new Error("");
    }
    const user = await prisma.user.update({
      where: {
        // @ts-ignore
        email,
      },
      data: { ...req.body },
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
