import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/auth";
import { prisma } from "lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import { EMAIL, PASSWORD } from "lib/constant";

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
    state,
  } = req.body;

  switch (type) {
    case "signup":
      const token = await generateToken(ic, email);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            token,
            fullname,
            username,
            ic,
            phone_no,
            address,
            postcode,
            state,
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
        if (user && (await bcrypt.compare(password, user.password))) {
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

    case "req_tac":
      const id = nanoid();
      try {
        const user = await prisma.user.update({
          where: {
            email,
          },
          data: {
            fp_token: id,
          },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        var mailOptions = {
          from: EMAIL,
          to: email,
          subject: "YOUR TAC NO.",
          text: id,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            return res.status(400).json({ message: "Email not sent" });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ message: "Check your email" });
          }
        });
      } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Email not sent" });
      }
      return res.status(400).json({ message: "Email not sent" });

    case "res_tac":
      try {
        const { code } = req.body;
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (!user.fp_token) {
          return res
            .status(404)
            .json({ message: "Please request the TAC again" });
        }
        if (user.fp_token === code) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await prisma.user.update({
            where: {
              email,
            },
            data: {
              password: hashedPassword,
            },
          });
          return res.status(200).json({ message: "Password updated" });
        }
      } catch (error) {
        return res
          .status(404)
          .json({ message: "Error carrying out this task" });
      }

    default:
      return res.status(405).json({ message: "Type not allowed" });
  }
}
