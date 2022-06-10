import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/auth";
import { prisma } from "lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
const Sib = require("sib-api-v3-sdk");

import {
  DESMOS_EMAIL,
  DESMOS_PASSWORD,
  SENDGRID_API_KEY,
  // GOOGLE_ACT,
  // GOOGLE_CID,
  // GOOGLE_CSE,
  // GOOGLE_RTK,
} from "lib/constant";
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
    year_of_birth,
    phone_no,
    address,
    postcode,
    gender,
    state,
  } = req.body;

  switch (type) {
    case "signup":
      const token = await generateToken(phone_no, email);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      try {
        const patient = await prisma.patient.findUnique({
          where: {
            // @ts-ignore
            phone_no,
          },
        });
        if (patient) {
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              token,
              fullname,
              username,
              phone_no,
              year_of_birth,
              address,
              postcode,
              state,
              group: "patient",
              patient: {
                connect: {
                  phone_no,
                },
              },
            },
          });
          return res
            .status(200)
            .json({ verified: true, token: user?.token, message: "ok" });
        } else {
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              token,
              fullname,
              username,
              year_of_birth,
              phone_no,
              address,
              postcode,
              state,
              gender,
            },
          });
          return res
            .status(200)
            .json({ verified: true, token: user?.token, message: "ok" });
        }
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
        // const client = Sib.ApiClient.instance;

        // const apiKey = client.authentications["api-key"];
        // apiKey.apiKey = SENDGRID_API_KEY;

        // const sender = {
        //   email: DESMOS_EMAIL,
        // };

        // const receiver = [
        //   {
        //     email,
        //   },
        // ];

        // const transactionalEmailApi = new Sib.TransactionalEmailsApi();

        // transactionalEmailApi
        //   .sendTransacEmail({
        //     subject: "Your TAC NO.",
        //     sender,
        //     to: receiver,
        //     textContent: `Your tac no to reset password: ${id}`,
        //     //         htmlContent: `
        //     // 	<h1>Become a {{params.role}} developer</h1>
        //     // 	<a href='https://cules-coding.vercel.app/'>Cules Coding</a>
        //     // `,
        //     params: {
        //       role: "frontend",
        //     },
        //   })
        //   .then(() => {
        //     return res
        //       .status(200)
        //       .json({ verified: true, message: "Check your email" });
        //   })
        //   .catch((error: any) => {
        //     return res
        //       .status(404)
        //       .json({
        //         error,
        //         verified: false,
        //         message: "Unable to send the email",
        //       });
        //   });

        let transporter = nodemailer.createTransport({
          port: 465,
          host: "smtp.gmail.com",
          service: "gmail",
          auth: {
            user: DESMOS_EMAIL,
            pass: DESMOS_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
          requireTLS: false,
          secure: false,
          debug: false,
        });

        // await new Promise((resolve, reject) => {
        //   // verify connection configuration
        //   transporter.verify(function (error, success) {
        //     if (error) {
        //       // console.log(error);
        //       reject(error);
        //     } else {
        //       // console.log("Server is ready to take our messages");
        //       resolve(success);
        //     }
        //   });
        // });

        // var generator = xoauth2.createXOAuth2Generator({
        //   user: DESMOS_EMAIL,
        //   clientId: GOOGLE_CID,
        //   clientSecret: GOOGLE_CSE,
        //   refreshToken: GOOGLE_RTK,
        //   accessToken: GOOGLE_ACT,
        // });
        // let transporter = nodemailer.createTransport({
        //   // @ts-ignore
        //   port: 587,
        //   // host: "smtp.gmail.com",
        //   service: "gmail",
        //   auth: { xoauth2: generator },
        //   tls: {
        //     rejectUnauthorized: false,
        //   },
        //   secure: false,
        //   ignoreTLS: false,
        //   debug: false,
        // });
        // console.log(transporter);

        var mailOptions = {
          from: DESMOS_EMAIL,
          to: email,
          subject: "YOUR TAC NO.",
          text: `Your tac no to reset password: ${id}`,
        };

        await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(400).json({
                error,
                verified: false,
                message: "Email not sent",
              });
            } else {
              return res.status(200).json({
                error,
                info,
                verified: true,
                message: "Check your email",
              });
            }
          });
        });

        return res.status(200).json({
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

    case "test":
      return res.status(200).json({ date: new Date() });

    default:
      return res.status(405).json({ message: "Type not allowed" });
  }
}
