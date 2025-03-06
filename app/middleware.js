import { NextResponse } from "next/server";

export function middleware(req) {
  const adminToken = req.cookies.get("adminToken")?.value; // ✅ Get cookie

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // 🔴 If trying to access `/admin`, but no valid admin token → Redirect to login
  if (isAdminRoute && (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_SECRET)) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🟢 If already logged in and trying to access `/admin/login` → Redirect to dashboard
  if (req.nextUrl.pathname === "/admin/login" && adminToken === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next(); // ✅ Allow access
}

// ✅ Ensure middleware runs only for `/admin/*`
export const config = {
  matcher: ["/admin/:path*"],
};
