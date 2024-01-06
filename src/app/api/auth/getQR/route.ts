import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";
import QRCode from "qrcode";
import { pusher } from "../../lib/pusher";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { secretKey } from "../../lib/keys";

export async function GET(req, res) {
  if (req.method === "GET") {
    // let token = uuidv4();
    const token = jwt.sign({}, secretKey, { expiresIn: "30s" });
    let generatedUrl = await QRCode.toDataURL(token);

    // console.log("hiiii", pusher);

    // pusher.trigger("my-channel", "my-event", {
    //   message: "hello world",
    // });
    console.log("triggered");

    return NextResponse.json(
      {
        message: "QR generated successfully",
        data: generatedUrl,
        temp: token,
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
