import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// --- Password Hashing ---

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // Increased cost factor
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Session Management ---

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex"); // Strong random token
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await deleteSession();
    return null;
  }

  // Optional: Refresh session expiration on usage if desired
  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    try {
      // Delete ONLY current session
      await prisma.session.delete({ where: { token } }).catch(() => {});
    } catch (_) {}
  }

  cookieStore.delete("session_token");
}

export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}
