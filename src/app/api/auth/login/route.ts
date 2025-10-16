import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";
import { secretKey } from "../../lib/keys";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

const generateToken = (mobileNumber) => {
  const payload = { mobileNumber };
  const secret = secretKey;
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secret, options);
};

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

    let { mobileNumber, password, token: tempToken } = await req.json();
    const db = await connectDB(req);
    if (tempToken) {
      let decoded;
      try {
        try {
          decoded = await jwt.verify(tempToken, secretKey);
        } catch (error) {
          return NextResponse.json(
            { error: "Access Denied! Token mismatch. Please try again." },
            { status: 500 }
          );
        }

        if (decoded?.id && decoded?.action === "login") {
          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(decoded?.id) });
          if (!user) {
            return NextResponse.json(
              { message: "User not exists" },
              { status: 401 }
            );
          }

          const token = jwt.sign({ id: user._id, userFingerprint }, secretKey);
          let now = new Date();
          let expirationDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);

          cookies().set("bahi_khata_user_token", token, {
            // expires: expirationDate,
            httpOnly: true,
            secure: true,
          });
          cookies().set(
            "bahi_khata_user_data",
            JSON.stringify({ mobileNumber, userId: user?._id }),
            {
              // expires: expirationDate,
              httpOnly: true,
              secure: true,
            }
          );

          return NextResponse.json(
            {
              userData: {
                mobileNumber,
                userId: user?._id,
              },
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { message: "Access Denied! Token mismatch. Please try again." },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 }
        );
      }
    } else {
      if (!mobileNumber || !password) {
        return NextResponse.json(
          { message: "Missing mobile number, or password" },
          { status: 400 }
        );
      }
      mobileNumber = parseInt(mobileNumber);
      password = password?.toString();

      const user = await db.collection("users").findOne({ mobileNumber });
      if (!user) {
        return NextResponse.json(
          { message: "Mobile number not exists" },
          { status: 401 }
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Password incorrect" },
          { status: 401 }
        );
      }

      const token = jwt.sign({ id: user._id, userFingerprint }, secretKey);
      let now = new Date();
      let expirationDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);

      cookies().set("bahi_khata_user_token", token, {
        // expires: expirationDate,
        httpOnly: true,
        secure: true,
      });
      cookies().set(
        "bahi_khata_user_data",
        JSON.stringify({ mobileNumber, userId: user?._id }),
        {
          //  expires: expirationDate,
          httpOnly: true,
          secure: true,
        }
      );

      return NextResponse.json(
        {
          userData: {
            mobileNumber,
            userId: user?._id,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
