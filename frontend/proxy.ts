import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that require the user to be logged in
const PROTECTED_PATHS = ["/checkout", "/orders", "/account", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // JWT is stored in localStorage (client-only), so we use a cookie fallback.
  // The auth store persists { isAuthenticated } in localStorage under "anvyra-auth".
  // We set a cookie on login so middleware can read it server-side.
  const authCookie = request.cookies.get("anvyra_authed")?.value;

  if (!authCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/account/:path*", "/profile/:path*"],
};
