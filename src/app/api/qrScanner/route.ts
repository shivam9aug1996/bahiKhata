import { NextResponse } from "next/server";
import { pusher } from "../lib/pusher";
import jwt from "jsonwebtoken";
import { secretKey } from "../lib/keys";
import { cookies } from "next/headers";
import { calculateSecondsElapsed } from "../lib/globalFun";
// import Pusher from "pusher";

// const pusher = new Pusher({
//   appId: "1735073",
//   key: "a7a14b0a75a3d073c905",
//   secret: "dd3949900fc1f693b821",
//   cluster: "ap2",
//   useTLS: true,
// });
export async function POST(req, res) {
  if (req.method === "POST") {
    let decoded;
    try {
      const { token } = await req?.json();
      console.log("hgfdfghjkf", token, calculateSecondsElapsed(token));
      // decoded = await jwt.verify(token, secretKey);
      if (token && calculateSecondsElapsed(token) <= 20) {
        let data = cookies().get("bahi_khata_user_data")?.value;
        if (data) data = JSON.parse(data);

        const newToken = await jwt.sign(
          { id: data?.userId, action: "login" },
          secretKey
        );
        console.log("kjhgfdfghjkl", newToken, token);

        pusher.trigger("my-channel", token, {
          message: "login",
          data: {
            newToken,
          },
        });
        // pusher.trigger("my-channel", token, {
        //   message: "login",
        //   data: {
        //     newToken,
        //   },
        // });

        return NextResponse.json(
          {
            message: "QR scanned successfully",
            token: token,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "Token Expires" }, { status: 400 });
      }
    } catch (error) {
      console.log("error", decoded, error);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
