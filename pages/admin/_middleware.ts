import { ADMIN, ADMIN_PWD } from "lib/constant";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next();
  // const basicAuth = req.headers.get("authorization");

  // if (basicAuth) {
  //   const auth = basicAuth.split(" ")[1];
  //   const [user, pwd] = Buffer.from(auth, "base64").toString().split(":");

  //   if (user === ADMIN && pwd === ADMIN_PWD) {
  //     return NextResponse.next();
  //   }
  // }

  // return new Response("Auth required", {
  //   status: 401,
  //   headers: {
  //     "WWW-Authenticate": 'Basic realm="Secure Area"',
  //   },
  // });
}
