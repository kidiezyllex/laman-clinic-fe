// import { cookies } from "next/headers";
// import { SignJWT, jwtVerify } from "jose";

// export async function encrypt() {
//   return new SignJWT()
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d");
//   // .sign();
// }
// export async function createSession(userId: string) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const session = await encrypt();

//   cookies().set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }
