import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const tagId = body?.tagId as string | undefined;

    if (!tagId) {
      return NextResponse.json({ error: "tagId required" }, { status: 400 });
    }

    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;

    const userAgent = req.headers.get("user-agent") || null;
    const referer = req.headers.get("referer") || null;

    const scan = await prisma.scan.create({
      data: {
        tagId,
        ip,
        userAgent,
        referer,
      },
    });

    return NextResponse.json({ scan });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to record scan" },
      { status: 500 }
    );
  }
}