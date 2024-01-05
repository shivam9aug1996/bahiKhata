import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function DELETE(req, res) {
  if (req.method === "DELETE") {
    try {
      const db = await connectDB(req);
      await db.collection("cache").deleteMany({});

      return NextResponse.json(
        {
          message: "Deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
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
