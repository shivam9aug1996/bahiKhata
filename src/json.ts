import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteCookies } from "./app/actions";
import { secretKey } from "./app/api/lib/keys";

export async function verifyToken(token, req) {
  try {
    const decoded = await jwt.verify(token, secretKey);
    let userAgentHeader = req?.headers?.get("user-agent");
    let userFingerprint = req.headers.get("user-fingerprint");
    if (
      decoded?.userAgentHeader === userAgentHeader &&
      userAgentHeader &&
      userFingerprint &&
      decoded?.userFingerprint === userFingerprint
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const isTokenVerified = async (req) => {
  let token = cookies().get("bahi_khata_user_token")?.value;
  if (token) {
    let isTokenVerified = await verifyToken(token, req);
    if (!isTokenVerified) {
      deleteCookies();
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
