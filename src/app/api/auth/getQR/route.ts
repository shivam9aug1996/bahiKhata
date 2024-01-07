import { NextResponse } from "next/server";
import QRCode from "qrcode";
// import jwt from "jsonwebtoken";
// import { secretKey } from "../../lib/keys";
// import { v4 as uuidv4 } from "uuid";

export async function POST(req, res) {
  if (req.method === "POST") {
    // const token = jwt.sign(
    //   {
    //     action: "login",
    //   },
    //   secretKey
    // );
    const token = new Date().getTime()?.toString();
    const generatedUrl = await QRCode.toDataURL(token);
    console.log("kjhgfdfghjkl", token);
    // const setCustomHeader = (res, headers) => {
    //   Object.entries(headers).forEach(([name, value]) => {
    //     res.headers.set(name, value);
    //   });
    //   return res;
    // };

    // const cacheHeader = () => {
    //   return {
    //     "Cache-Control": "no-store",
    //   };
    // };

    // return setCustomHeader(
    //   NextResponse.json(
    //     {
    //       message: "QR generated successfully",
    //       data: generatedUrl,
    //       temp: token,
    //       timeStamp: new Date().getTime(),
    //     },
    //     { status: 201 }
    //   ),
    //   cacheHeader()
    // );
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
