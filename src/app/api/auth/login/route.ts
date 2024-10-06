import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await clerkClient.users.createUser({
      emailAddress: body.email,
      password: body.password,
    });
    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" });
  }
}
