import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimitForAPI } from "./json";

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("bahi_khata_user_token")?.value;
  let fp = request.headers.get("user-fingerprint");
  const currentPath = request.nextUrl.pathname;
  if (currentPath === "/whatsapp-script.js") {
    return NextResponse.next();
  }
  if (!userToken) {
    if (currentPath.startsWith("/dashboard")) {
      let message = "token not exists";
      // User is not authenticated and trying to access a dashboard route, redirect to login
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent(message)}`, request.url)
      );
    }
    //     businessId: 6623cf25f271086b5380b03e
    // partyId: 671472bfdc2b8d12b2e09d62
    if (
      currentPath.startsWith("/api") &&
      !currentPath.includes("/api/auth") &&
      !currentPath.includes("/api/transactionList/public")
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication failed" }),
        { status: 401 }
      );
    } else if (currentPath.includes("api/auth/signup")) {
      if (!fp) {
        return new NextResponse(
          JSON.stringify({ error: "Fingerprint header is needed" }),
          { status: 400 }
        );
      }
      if (checkRateLimitForAPI(fp, 2)) {
        return new NextResponse(
          JSON.stringify({ error: "Rate limit exceeded, wait for 60 seconds" }),
          { status: 429 }
        );
      } else {
        return NextResponse.next();
      }
    } else {
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
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/",
    "/signup",
    "/api/:path*",
    "/whatsapp-script.js",
  ],
};
