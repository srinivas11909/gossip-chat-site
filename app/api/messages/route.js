import { NextResponse } from "next/server";

let messages = [];
let clients = new Set(); 

export async function GET(req) {
  if (req.headers.get("accept") === "text/event-stream") {
    const stream = new ReadableStream({
      start(controller) {
        const sendUpdate = (message) => {
          controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
        };

        clients.add(sendUpdate); 
        messages.forEach(sendUpdate)

        req.signal.addEventListener("abort", () => {
          clients.delete(sendUpdate); 
          controller.close(); // ✅ Properly close the stream
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

// import { NextResponse } from "next/server";

// let messages = []; 

// export async function GET() {
//   return NextResponse.json(messages);
// }

// export async function POST(req) {
//   try {
//     const msg = await req.json();
//     messages.push(msg);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
//   }
// }

// import { kv } from "@vercel/kv";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const messages = await kv.lrange("chatMessages", 0, -1); // ✅ Get all messages from KV
//     return NextResponse.json(messages || []);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const msg = await req.json();
//     await kv.rpush("chatMessages", JSON.stringify(msg)); // ✅ Store message in KV
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error storing message:", error);
//     return NextResponse.json({ error: "Failed to store message" }, { status: 500 });
//   }
// }
