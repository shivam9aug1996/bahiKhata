import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import QRCode from "qrcode";
import { pusher } from "../lib/pusher";
import jwt from "jsonwebtoken";
import { secretKey } from "../lib/keys";

export async function POST(req, res) {
  if (req.method === "POST") {
    let decoded;
    try {
      const { token } = await req?.json();
      console.log(token);
      decoded = await jwt.verify(token, secretKey);
      // pusher.trigger("my-channel", id, {
      //   message: "hello world",
      // });
      console.log("decoded", decoded);
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
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
