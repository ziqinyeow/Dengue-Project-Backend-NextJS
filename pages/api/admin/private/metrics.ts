import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const user = await prisma.user.count();
        const total_user = user;

        const patient = await prisma.patient.count();
        const total_patient = patient;

        const vital_sign = await prisma.vital_sign.count();
        const total_vital_sign = vital_sign;

        const blood_profile = await prisma.blood_profile.count();
        const total_blood_profile = blood_profile;

        const history = await prisma.history.count();
        const total_history = history;

        const seek_help_form = await prisma.seek_help_form.count();
        const total_seek_help_form = seek_help_form;

        const symptom = await prisma.symptom.count();
        const total_symptom = symptom;

        const answer = await prisma.answer.count();
        const total_answer = answer;

        return res.status(200).json({
          total_user,
          total_patient,
          total_vital_sign,
          total_blood_profile,
          total_history,
          total_seek_help_form,
          total_symptom,
          total_answer,
        });
      } catch (error) {
        return res.status(400).json({ message: "Unable to get data" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
