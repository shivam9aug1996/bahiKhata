import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

const saltRounds = 10;

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    let { mobileNumber, password } = await req.json();

    console.log(mobileNumber, password);
    if (!mobileNumber || !password) {
      return NextResponse.json(
        { message: "Missing mobile number or password" },
        { status: 400 }
      );
    }
    mobileNumber = parseInt(mobileNumber);
    password = password?.toString();

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const db = await connectDB();
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

    const token = jwt.sign({ id: results.insertedId }, "secretkey");
    // cookies().set("token", token);
    cookies().set("bahi_khata_user_token", token);
    cookies().set(
      "bahi_khata_user_data",
      JSON.stringify({ mobileNumber, userId: results.insertedId })
    );
    return NextResponse.json(
      {
        token,
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
