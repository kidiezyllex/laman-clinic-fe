import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

// CREATE (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notification = await prisma.notification.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Failed to create notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const notifications = await prisma.notification.findMany();
  return NextResponse.json(notifications);
}
