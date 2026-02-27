import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const code = body?.code as string | undefined;
  const message = (body?.message as string | undefined) ?? null;
  const lat = typeof body?.lat === "number" ? body.lat : null;
  const lng = typeof body?.lng === "number" ? body.lng : null;

  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  const tag = await prisma.tag.findUnique({ where: { code } });
  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  const report = await prisma.foundReport.create({
    data: {
      tagId: tag.id,
      message,
      lat,
      lng,
    },
  });

  return NextResponse.json({ ok: true, reportId: report.id });
}