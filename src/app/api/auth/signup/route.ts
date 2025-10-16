import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";
import { secretKey } from "../../lib/keys";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

const saltRounds = 10;

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }
    let userAgentHeader = req.headers.get("user-agent");
    let userFingerprint = req.headers.get("user-fingerprint");
    let { mobileNumber, password } = await req.json();
    if (!mobileNumber || !password) {
      return NextResponse.json(
        { message: "Missing mobile number or password" },
        { status: 400 }
      );
    }
    mobileNumber = parseInt(mobileNumber);
    password = password?.toString();

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const db = await connectDB(req);
    const existingUser = await db.collection("users").findOne({ mobileNumber });
    if (existingUser) {
      return NextResponse.json(
        { message: "Mobile number already exists" },
        { status: 403 }
      );
    }
    const results = await db.collection("users").insertOne({
      mobileNumber,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: results.insertedId, userFingerprint },
      secretKey
    );
    // cookies().set("token", token);

    let now = new Date();
    let expirationDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    cookies().set("bahi_khata_user_token", token, {
      // expires: expirationDate,
      httpOnly: true,
      secure: true,
      //sameSite: "strict",
    });
    cookies().set(
      "bahi_khata_user_data",
      JSON.stringify({ mobileNumber, userId: results.insertedId }),
      {
        // expires: expirationDate,
        httpOnly: true,
        secure: true,
        // sameSite: "strict",
      }
    );
    return NextResponse.json(
      {
        // token,
        userData: {
          mobileNumber,
          userId: results.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
