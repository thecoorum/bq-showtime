import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

const middleware = async (req: NextRequest) => {
  let response = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );

          response = NextResponse.next({
            request: req,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/login/confirm") {
    const url = req.nextUrl.clone();
    const redirectUrl = url.pathname;

    url.pathname = "/login";

    if (!url.searchParams.has("redirect-url")) {
      url.searchParams.set("redirect-url", redirectUrl);
    }

    console.log("redirect to login");

    return NextResponse.redirect(url);
  }

  if (user && req.nextUrl.pathname.startsWith("/login")) {
    const url = req.nextUrl.clone();

    url.pathname = "/";

    console.log("redirect to home");

    return NextResponse.redirect(url);
  }

  return response;
};

export default middleware;
