import { NextResponse } from "next/server";
import onlineUsers from "../../users/route"; // ✅ Import the existing user list

// ✅ Middleware: Protect Admin Access
const isAdmin = (req) => {
    const adminToken = req.headers.get("authorization");
    return adminToken === process.env.NEXT_PUBLIC_ADMIN_SECRET;
};

// ✅ Get All Online Users (For Admin Panel)
export async function GET(req) {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json(onlineUsers);
}

// ✅ Remove a User from Online List
export async function DELETE(req) {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { username } = await req.json();
    onlineUsers = onlineUsers.filter(user => user.username !== username);

    return NextResponse.json({ success: true });
}
