import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditTagForm from "./EditTagForm";

export default async function EditTagPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) notFound();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) notFound();

  const tag = await prisma.tag.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      ownerName: true,
      phone: true,
      whatsapp: true,
      imageUrl: true,
    },
  });

  if (!tag) notFound();

  return (
    <main className="min-h-screen w-full bg-zinc-50">
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="w-full px-4 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              ← Back
            </Link>
            <div>
              <div className="text-lg font-semibold">Edit Tag</div>
              <div className="text-sm text-zinc-500">Update your tag info</div>
            </div>
          </div>
        </div>
      </div>

      <EditTagForm initialTag={tag} />
    </main>
  );
}