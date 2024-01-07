import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { secretKey } from "../../lib/keys";

export async function GET(req, res) {
  if (req.method === "GET") {
    const token = jwt.sign(
      {
        action: "login",
        timestamp: new Date().getTime(),
      },
      secretKey
      // { expiresIn: "30s" }
    );
    const generatedUrl = await QRCode.toDataURL(token);

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
