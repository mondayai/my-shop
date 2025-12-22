import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
    });
    console.log("API Banners fetched:", banners);
    return NextResponse.json(banners);
  } catch (error) {
    console.error("API Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners", details: String(error) },
      { status: 500 }
    );
  }
}
