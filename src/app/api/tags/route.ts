import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function makeCode() {
  return (
    Math.random().toString(36).slice(2, 10) +
    "-" +
    Math.random().toString(36).slice(2, 10)
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = (body?.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const tag = await prisma.tag.create({
      data: {
        code: makeCode(),
        title,
        description: (body?.description || "").trim() || null,
        imageUrl: (body?.imageUrl || "").trim() || null,
        ownerName: (body?.ownerName || "").trim() || null,
        phone: (body?.phone || "").trim() || null,
        whatsapp: (body?.whatsapp || "").trim() || null,
        userId: user.id,
      },
      select: { id: true, code: true, title: true },
    });

    // ✅ revalidate ONLY after DB write, inside request scope
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/new");

    return NextResponse.json({ ok: true, tag });
  } catch (e: any) {
    console.error("CREATE_TAG_ERROR", e);
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}