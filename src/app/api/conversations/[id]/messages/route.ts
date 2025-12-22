import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/conversations/[id]/messages
// Fetch messages with pagination and mark as read
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Expecting params to be a Promise in Next.js 15+ (Next 16)
) {
  try {
    const { id: conversationId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get("x-user-id"); // Mock Auth
    const senderType = req.headers.get("x-sender-type") || "USER"; // USER or BRAND

    // Pagination
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor"); // Message ID to start after

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "asc" }, // Oldest first for chat history? Or Newest first?
      // Typically for chat UI, we fetch newest first (reverse) or oldest first (history).
      // Given the index is `createdAt(sort: Asc)`, let's fetch Ascending (History).
      include: {
        sender: {
          select: { name: true },
        },
      },
    });

    // 2. Mark as Read (Side Effect)
    // We update the reader's lastReadAt
    if (senderType === "USER") {
      await prisma.conversation.update({ด
        where: { id: conversationId },
        data: { userLastReadAt: new Date() },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { brandLastReadAt: new Date() },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[id]/messages
// Send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await req.json();
    const { content } = body;
    const userId = req.headers.get("x-user-id"); // Sender ID
    const senderType =
      (req.headers.get("x-sender-type") as "USER" | "BRAND") || "USER";

    if (!userId || !content) {
      return NextResponse.json(
        { error: "Missing content or userId" },
        { status: 400 }
      );
    }

    // Transaction: Create Message + Update Conversation
    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          senderType,
          content,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: content,
          lastMessageAt: new Date(),
          // Optional: Increment unread count logic if we stored it,
          // but we use timestamps so no need to increment a counter field.
        },
      }),
    ]);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
