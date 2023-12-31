import { cookieKey } from "@/app/constants";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    let { mobileNumber } = await req.json();

    if (!mobileNumber) {
      return NextResponse.json(
        { message: "Missing mobile number, or password" },
        { status: 400 }
      );
    }
    mobileNumber = parseInt(mobileNumber);

    const db = await connectDB(req);
    const user = await db.collection("users").findOne({ mobileNumber });
    if (!user) {
      return NextResponse.json(
        { message: "Mobile number not exists", numberExists: false },
        { status: 401 }
      );
    }

    // const {
    //   email: userEmail,
    //   name,
    //   addresses,
    //   isAdmin = false,
    //   face_data = null,
    // } = user;
    //cookies().set(cookieKey, JSON.stringify({ mobileNumber }));
    // cookies().set(
    //   "userData",
    //   JSON.stringify({
    //     token,
    //     email: userEmail,
    //     name,
    //     id: user._id,
    //     addresses,
    //     isAdmin,
    //     face_data,
    //   })
    // );
    return NextResponse.json(
      {
        numberExists: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
