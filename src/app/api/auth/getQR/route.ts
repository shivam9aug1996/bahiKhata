import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { secretKey } from "../../lib/keys";
// import { v4 as uuidv4 } from "uuid";

export async function GET(req, res) {
  if (req.method === "GET") {
    // const token = jwt.sign(
    //   {
    //     action: "login",
    //   },
    //   secretKey
    // );
    const token = new Date().getTime();
    const generatedUrl = await QRCode.toDataURL(token);
    console.log("kjhgfdfghjkl", token);
    return NextResponse.json(
      {
        message: "QR generated successfully",
        data: generatedUrl,
        temp: token,
        timeStamp: new Date().getTime(),
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
