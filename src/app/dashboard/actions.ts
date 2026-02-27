"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTagAction(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return;

  // ✅ Use deleteMany so it NEVER throws P2025
  await prisma.tag.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}