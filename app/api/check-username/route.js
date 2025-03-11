import { NextResponse } from "next/server";

let onlineUsers = []; // Your online users list

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const isTaken = onlineUsers.some((u) => u.username.toLowerCase() === username.toLowerCase());
  return NextResponse.json({
    exists: isTaken,
    suggestions: isTaken ? generateUsernameSuggestions(username) : [],
  });
}

// 🔹 Generate random username suggestions
function generateUsernameSuggestions(baseUsername) {
  return Array.from({ length: 3 }, () => `${baseUsername}${Math.floor(100 + Math.random() * 900)}`);
}
