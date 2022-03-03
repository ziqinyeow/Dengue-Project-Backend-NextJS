import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/auth";
import { prisma } from "lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import { DESMOS_EMAIL, DESMOS_PASSWORD } from "lib/constant";
import otpGenerator from "otp-generator";

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
      const id = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let detail = null;
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
          return res
            .status(404)
            .json({ verified: false, message: "User not found" });
        }
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: DESMOS_EMAIL,
            pass: DESMOS_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        var mailOptions = {
          from: DESMOS_EMAIL,
          to: email,
          subject: "YOUR TAC NO.",
          text: `Your tac no to reset password: ${id}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            detail = error;

            return res
              .status(400)
              .json({ error, verified: false, message: "Email not sent" });
          } else {
            detail = info;
            return res.status(200).json({ message: "Check your email" });
          }
        });
        return res.status(200).json({
          detail,
          verified: true,
          message: "Check your email",
        });
      } catch (error) {
        return res
          .status(400)
          .json({ error, verified: false, message: "Email not sent" });
      }

    case "ver_tac":
      try {
        const { code } = req.body;
        if (!code && code == "") {
          return res.status(400).json({ verified: false, message: "No OTP" });
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return res
            .status(404)
            .json({ verified: false, message: "User not found" });
        }
        if (!user.fp_token) {
          return res
            .status(404)
            .json({ message: "Please request the TAC again" });
        }
        if (user.fp_token === code) {
          return res.status(200).json({ verified: true, message: "ok" });
        } else {
          return res
            .status(400)
            .json({ verified: false, message: "Invalid OTP" });
        }
      } catch (error) {
        return res
          .status(404)
          .json({ verified: false, message: "Error carrying out this task" });
      }

    case "res_tac":
      try {
        const { code } = req.body;
        if (!code && code == "") {
          return res.status(400).json({ verified: false, message: "No OTP" });
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return res
            .status(404)
            .json({ verified: false, message: "User not found" });
        }
        if (!user.fp_token) {
          return res
            .status(404)
            .json({ verified: false, message: "Please request the TAC again" });
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
              fp_token: "",
            },
          });
          return res
            .status(200)
            .json({ verified: true, message: "Password updated" });
        }
      } catch (error) {
        return res
          .status(404)
          .json({ verified: false, message: "Error carrying out this task" });
      }

    default:
      return res.status(405).json({ message: "Type not allowed" });
  }
}
