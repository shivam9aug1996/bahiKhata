import { NextResponse } from "next/server";
import { pusher } from "../lib/pusher";
import jwt from "jsonwebtoken";
import { secretKey } from "../lib/keys";
import { cookies } from "next/headers";

export async function POST(req, res) {
  if (req.method === "POST") {
    let decoded;
    try {
      const { token } = await req?.json();
      console.log(token);
      decoded = await jwt.verify(token, secretKey);
      if (decoded?.action === "login") {
        let data = cookies().get("bahi_khata_user_data")?.value;
        if (data) data = JSON.parse(data);

        const newToken = await jwt.sign(
          { id: data?.userId, action: "login" },
          secretKey,
          {
            expiresIn: "20s",
          }
        );
        pusher.trigger("my-channel", token, {
          message: "login",
          data: {
            newToken,
          },
        });
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "QR scanned successfully",
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
