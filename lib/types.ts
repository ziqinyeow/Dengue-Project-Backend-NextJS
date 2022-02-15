import { NextApiRequest, NextApiResponse } from "next";

export type NextApiRequestWithUser = NextApiRequest & {
  user: {
    id: string;
    name: string | null;
    email: string;
    password: string;
    token: string | null;
    status: string | null;
  };
};
