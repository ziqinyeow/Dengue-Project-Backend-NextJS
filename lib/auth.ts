// @ts-nocheck
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { TOKEN_SECRET } from "./constant";
import { JsonResponse } from "./utils";

export const verify = async (req: NextRequestWithUser) => {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return JsonResponse(401, { error: { message: "Unauthorized" } });
    }
    const token = auth.split(" ")[1];
    const { payload, protectedHeader } = await jwtVerify(
      token,
      new TextEncoder().encode(TOKEN_SECRET)
    );
    const { id, email } = payload;
    if (!id || !email) {
      return JsonResponse(404, { error: { message: "User not found" } });
    }

    req.user = user;
    NextResponse.next();
  } catch (error) {
    return JsonResponse(404, { error: { message: "User not found" } });
  }
};
