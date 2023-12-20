import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("bahi_khata_user_token")?.value;
  const currentPath = request.nextUrl.pathname;
  console.log("lkjhgr456789", currentPath);
  if (!userToken) {
    if (currentPath.startsWith("/dashboard")) {
      // User is not authenticated and trying to access a dashboard route, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
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
    // User is authenticated and trying to access the login page, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard/customers", request.url));
  } else {
    // User is authenticated, allow access to all dashboard routes
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/", "/signup"],
};
