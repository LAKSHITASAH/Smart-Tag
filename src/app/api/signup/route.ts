import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name || "").trim();
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name: name || null, email, password: hash },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("SIGNUP_ERROR:", e?.message || e, e);
    return NextResponse.json(
      { error: e?.message || "Signup failed" },
      { status: 500 }
    );
  }
}