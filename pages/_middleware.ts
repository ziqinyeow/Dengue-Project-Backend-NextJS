import { jwtVerify } from "jose";
import { TOKEN_SECRET } from "lib/constant";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.url;

  // give access to mobile
  if (url.includes("/api/user") || url.includes("/api/auth")) {
    return NextResponse.next();
  }

  // web auth
  const { cookies } = req;

  const jwt = cookies.token;

  if (url.includes("/login")) {
    if (jwt) {
      try {
        const { payload } = await jwtVerify(
          jwt,
          new TextEncoder().encode(TOKEN_SECRET)
        );

        if (payload) {
          return NextResponse.redirect("/admin");
        } else {
          return NextResponse.next();
        }
      } catch (error) {
        return NextResponse.next();
      }
    } else {
      return NextResponse.next();
    }
  }

  if (url.includes("/admin")) {
    if (!jwt || jwt == undefined) {
      return NextResponse.redirect("/login");
    }

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
  return NextResponse.next();
}
