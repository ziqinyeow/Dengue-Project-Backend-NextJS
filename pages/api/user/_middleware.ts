import { NextRequest, NextResponse } from "next/server";
import { TOKEN_SECRET } from "lib/constant";
import { JsonResponse } from "lib/utils";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth || auth.split(" ")[0] !== "Bearer") {
      return JsonResponse(401, { message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(TOKEN_SECRET)
    );

    const { email } = payload;

    NextResponse.next();
  } catch (error) {
    return JsonResponse(404, { message: "User not found" });
  }
}
