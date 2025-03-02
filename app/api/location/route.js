import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://ipwho.is/", {
      cache: "no-store", // Prevents caching issues on Vercel
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Location API Error:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}
