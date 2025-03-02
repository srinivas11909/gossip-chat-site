import { NextResponse } from "next/server";

let messages = [];
let clients = new Set(); // Use Set instead of array for better memory management

export async function GET(req) {
  if (req.headers.get("accept") === "text/event-stream") {
    const stream = new ReadableStream({
      start(controller) {
        const sendUpdate = (message) => {
          controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
        };

        clients.add(sendUpdate); // ✅ Use Set to prevent duplicates

        req.signal.addEventListener("abort", () => {
          clients.delete(sendUpdate); // ✅ Remove disconnected clients
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  return NextResponse.json(messages);
}

export async function POST(req) {
  const msg = await req.json();
  messages.push(msg);
  
  // ✅ Send the new message to all connected clients
  clients.forEach((client) => client(msg));

  return NextResponse.json({ success: true });
}
