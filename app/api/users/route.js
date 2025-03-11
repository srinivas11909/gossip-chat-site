// import { NextResponse } from "next/server";

// let onlineUsers = [];
// let clients = [];

import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";


let onlineUsers = [];
let clients = [];


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
   // Check if username exists in MongoDB
   await connectToDatabase(); 
   if (username) {
    //const { db } = await connectToDatabase();
    const userExists = await User.findOne({ username: username.toLowerCase() });

    return NextResponse.json({
        exists: !!userExists, 
        suggestions: userExists ? generateUsernameSuggestions(username) : [],
    });
}
  //Handle SSE for login users
  if (req.headers.get("accept") === "text/event-stream") {
    const stream = new ReadableStream({
      async start(controller) {
        const sendUpdate = async () => {
          //const { db } = await connectToDatabase();
          //const users = await db.collection("users").find().toArray();
          const users = await User.find().lean();
          controller.enqueue(`data: ${JSON.stringify(users)}\n\n`);
        };

        clients.push(sendUpdate);
        await sendUpdate();

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
  
  // const { db } = await connectToDatabase();
  // const users = await db.collection("users").find().toArray();
  const users = await User.find().lean();

  return NextResponse.json(users);
}

export async function POST(req) {
  const user = await req.json();
  await connectToDatabase();
  const existingUser = await User.findOne({ username: user.username });
  if (!existingUser) {
    await User.create({ 
        username: user.username,
        age: user.age,
        gender: user.gender,
        country: user.country,
        state: user.state,
        countryName: user.countryName,
        stateName: user.stateName,
        joinedAt: new Date()
    });
}
  // if (!onlineUsers.find((u) => u.username === user.username)) {
  //   onlineUsers.push(user);
  // }
  clients.forEach((client) => client());
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { username } = await req.json();
  await connectToDatabase();
  await User.deleteOne({ username: username.toLowerCase() });

 // onlineUsers = onlineUsers.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  clients.forEach((client) => client());
  return NextResponse.json({ success: true });
}

// 🔹 Generate random username suggestions
function generateUsernameSuggestions(baseUsername) {
  return Array.from({ length: 3 }, () => `${baseUsername}${Math.floor(100 + Math.random() * 900)}`);
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
