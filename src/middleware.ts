import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("hiiiii", request);
  const userToken = request.cookies.get("bahi_khata_user_token")?.value;
  const currentPath = request.nextUrl.pathname;
  console.log("lkjhgr456789", currentPath, request.url, request.nextUrl);
  if (!userToken) {
    if (currentPath.startsWith("/dashboard")) {
      let message = "token not exists";
      console.log("oiuytrdfghjkl");
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
    //write a fetch api call
    // let urlToFetch = request?.url?.split(currentPath)[0];
    // const response = await fetch(`${urlToFetch}/api/verifyToken`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${userToken}`, // Pass the user token in the Authorization header if needed
    //     // Add other headers if necessary
    //   },
    //   // Add other fetch options like body, etc.
    // });

    // if (response.ok) {
    //   const data = await response.json();
    //   // Process the fetched data as needed
    //   console.log("Fetched data:", data);
    // } else {
    //   console.error("Fetch request failed:", response.status);
    //   // Handle failed fetch request
    // }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/", "/signup", "/api/:path*"],
};
