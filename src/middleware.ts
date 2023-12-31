import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimitForAPI } from "./json";

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("bahi_khata_user_token")?.value;
  let fp = request.headers.get("user-fingerprint");
  const currentPath = request.nextUrl.pathname;
  if (!userToken) {
    if (currentPath.startsWith("/dashboard")) {
      let message = "token not exists";
      // User is not authenticated and trying to access a dashboard route, redirect to login
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent(message)}`, request.url)
      );
    }
    if (currentPath.startsWith("/api") && !currentPath.includes("/api/auth")) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication failed" }),
        { status: 401 }
      );
    } else if (currentPath.includes("api/auth/signup")) {
      console.log("kjhgfr5678");

      if (checkRateLimitForAPI(fp, 2)) {
        console.log("hiiiiiuytfghji876");
        return new NextResponse(
          JSON.stringify({ error: "Rate limit exceeded, wait for 60 seconds" }),
          { status: 429 }
        );
      } else {
        return NextResponse.next();
      }
    } else {
      console.log("jhgfdfghj", fp);

      // User is not authenticated, allow access to other pages
      return NextResponse.next();
    }
  } else if (
    currentPath === "/login" ||
    currentPath === "/signup" ||
    currentPath === "/" ||
    currentPath === "/dashboard"
  ) {
    return NextResponse.redirect(new URL("/dashboard/customers", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/", "/signup", "/api/:path*"],
};
