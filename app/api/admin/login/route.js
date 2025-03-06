import { NextResponse } from "next/server";

export async function GET(req) {
  const adminToken = req.cookies.get("adminToken")?.value;

  if (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // 🔴 Block unauthorized access
  }

  return NextResponse.json({ message: "Welcome, Admin!" });
}
