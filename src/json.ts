import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteCookies } from "./app/actions";
import { secretKey } from "./app/api/lib/keys";

export async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, secretKey);
    console.log("hgre5678ihbn", decoded);
    return true;
  } catch (error) {
    console.log("hiooo", error);
    return false;
  }
}

export const isTokenVerified = async () => {
  let token = cookies().get("bahi_khata_user_token")?.value;
  if (token) {
    let isTokenVerified = await verifyToken(token);
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
