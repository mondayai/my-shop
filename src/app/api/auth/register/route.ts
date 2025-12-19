import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // 1. Validation Logic
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Hash Password
    const passwordHash = await hashPassword(password);

    // 3. Create User (Handle Race Condition via Try/Catch on Unique Constraint)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
      },
    });

    // 4. Create Session
    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle Zod Validation Errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    // Handle Prisma Unique Constraint Violation (Race Condition)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
