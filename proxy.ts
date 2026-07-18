import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = new Set([
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/email-confirmation",
    "/auth/otp",
]);

const REDIRECT_TARGET = "/dashboard";

async function hasValidSession(request: NextRequest): Promise<boolean> {
    // Fast path: no auth cookie usually means no session.
    const hasSessionCookie = request.cookies.has("better-auth.session_token")
        || request.cookies.has("__Secure-better-auth.session_token");

    if (!hasSessionCookie) {
        return false;
    }

    try {
        const sessionUrl = new URL("/api/auth/get-session", request.url);
        const response = await fetch(sessionUrl, {
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as { user?: unknown; session?: unknown };
        return Boolean(data?.session && data?.user);
    } catch {
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!AUTH_PAGES.has(pathname)) {
        return NextResponse.next();
    }

    if (await hasValidSession(request)) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_TARGET;
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/:path*"],
};