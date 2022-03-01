import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import { TOKEN_SECRET } from "./constant";
import { prisma } from "./prisma";

export const generateToken = async (ic: string, email: string) => {
  const token = await new SignJWT({
    ic,
    email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    // .setExpirationTime('2h')
    .sign(new TextEncoder().encode(TOKEN_SECRET));

  return token;
};

export const verifyAPI = async (auth: string | undefined) => {
  try {
    const token = auth && auth.split(" ")[1];
    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(TOKEN_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Get and verify email from JWT Token in the request headers
 * Only registered email can access their own data
 * @param auth: req.headers["authorization"]
 * @returns user details
 */
export const verifyUser = async (auth: string | undefined) => {
  try {
    const token = auth && auth.split(" ")[1];
    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(TOKEN_SECRET)
    );

    const { email } = payload;

    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        email,
      },
      select: {
        id: true,
        email: true,
        detail: true,
        username: true,
        fullname: true,
        phone_no: true,
        group: true,
        ic: true,
        address: true,
        postcode: true,
      },
    });

    return user || null;
  } catch (error) {
    return null;
  }
};
