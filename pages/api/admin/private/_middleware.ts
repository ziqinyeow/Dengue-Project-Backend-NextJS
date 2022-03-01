import { jwtVerify } from "jose";
import { TOKEN_SECRET } from "lib/constant";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { cookies } = req;
  const jwt = cookies.token;

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(TOKEN_SECRET)
    );
    if (payload) {
      return NextResponse.next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return NextResponse.redirect("/login");
  }
}
