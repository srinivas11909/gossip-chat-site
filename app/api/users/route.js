// import { NextResponse } from "next/server";

// let onlineUsers = [];
// let clients = [];

import { NextResponse } from "next/server";

let onlineUsers = [];
let clients = [];

export async function GET(req) {
  if (req.headers.get("accept") === "text/event-stream") {
    const stream = new ReadableStream({
      start(controller) {
        const sendUpdate = () => {
          controller.enqueue(`data: ${JSON.stringify(onlineUsers)}\n\n`);
        };

        clients.push(sendUpdate);
        sendUpdate();

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

  return NextResponse.json(onlineUsers);
}

export async function POST(req) {
  const user = await req.json();
  if (!onlineUsers.find((u) => u.username === user.username)) {
    onlineUsers.push(user);
  }
  clients.forEach((client) => client());
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { username } = await req.json();
  onlineUsers = onlineUsers.filter((u) => u.username !== username);
  clients.forEach((client) => client());
  return NextResponse.json({ success: true });
}

// export async function GET(req) {
//   const url = new URL(req.url);
//   const country = url.searchParams.get("country");
//   const state = url.searchParams.get("state");

//   let filteredUsers = onlineUsers;
//   if (country) {
//     filteredUsers = filteredUsers.filter(user => user.country === country);
//   }
//   if (state) {
//     filteredUsers = filteredUsers.filter(user => user.state === state);
//   }

//   return NextResponse.json(filteredUsers);
// }

// export async function POST(req) {
//   const user = await req.json();
//   if (!onlineUsers.find((u) => u.username === user.username)) {
//     onlineUsers.push(user);
//   }
//   return NextResponse.json({ success: true });
// }

// export async function DELETE(req) {
//   const { username } = await req.json();
//   onlineUsers = onlineUsers.filter((user) => user.username !== username);
//   return NextResponse.json({ success: true });
// }
