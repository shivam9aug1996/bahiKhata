import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("bahi_khata_user_token")?.value;
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
  matcher: ["/dashboard/:path*", "/login", "/", "/signup", "/api/:path*"],
};
