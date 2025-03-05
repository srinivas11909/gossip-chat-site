import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    //const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8"; // ✅ Get the real client IP
    //const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0];
    let ip =
      req.headers.get("cf-connecting-ip") || // ✅ Cloudflare IP
      req.headers.get("x-forwarded-for")?.split(",")[0] || // ✅ Vercel / Proxies
      null;

    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      // ✅ If testing locally, get external IP
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      ip = ipData.ip;
    }
    console.log(ip)
    const response = await fetch(`https://ipwho.is/${ip}`, {
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
