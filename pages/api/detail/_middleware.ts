import { NextRequest, NextResponse } from "next/server";
import { TOKEN_SECRET } from "lib/constant";
import { JsonResponse } from "lib/utils";
import { jwtVerify } from "jose";

type User = {
  id: string;
  email: string;
};

type NextRequestWithUser = NextRequest & {
  user: User;
};

export async function middleware(req: NextRequestWithUser) {
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

    console.log(payload);

    // @ts-ignore
    req.user = { id, email };
    NextResponse.next();
  } catch (error) {
    return JsonResponse(404, { error: { message: "User not found" } });
  }
}
