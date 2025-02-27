import { NextResponse } from "next/server";

let messages = [];
let clients = [];

export async function GET(req) {
  if (req.headers.get("accept") === "text/event-stream") {
    const stream = new ReadableStream({
      start(controller) {
        const sendUpdate = (message) => {
          controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
        };

        clients.push(sendUpdate);

        req.signal.addEventListener("abort", () => {
          clients = clients.filter((c) => c !== sendUpdate);
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
  clients.forEach((client) => client(msg));
  return NextResponse.json({ success: true });
}
