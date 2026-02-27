import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteTagAction } from "./actions";
import { unstable_noStore as noStore } from "next/cache";

function DashboardHeader() {
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="w-full px-4 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            ← Back
          </Link>

          <div>
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-sm text-zinc-500">Manage your tags</div>
          </div>
        </div>

        <Link
          href="/dashboard/new"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New Tag
        </Link>
      </div>
    </div>
  );
}

function TagCard({ t }: { t: any }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          {t.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.imageUrl} alt={t.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-zinc-500">
              No photo
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-zinc-900">{t.title}</div>
              <div className="truncate text-sm text-zinc-600">{t.description || "No notes"}</div>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={`/t/${t.code}`}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Open scan page
            </Link>

            {/* Edit (owner edits info) */}
            <Link
              href={`/dashboard/tags/${t.id}/edit`}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
            >
              Edit
            </Link>

            {/* Delete */}
            <form action={deleteTagAction}>
              <input type="hidden" name="id" value={t.id} />
              <button
                type="submit"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </form>

            <div className="ml-auto text-xs text-zinc-500">
              Code: <span className="font-mono">{t.code}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  noStore(); // ✅ Always fetch fresh data from DB on every request

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen w-full bg-zinc-50">
        <DashboardHeader />
        <div className="w-full px-4 sm:px-10 py-10">
          <div className="max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-zinc-600">
              You are not logged in.{" "}
              <Link className="underline" href="/login">
                Go to login
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });

  const tags = user
    ? await prisma.tag.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          imageUrl: true,
          createdAt: true,
        },
      })
    : [];

  return (
    <main className="min-h-screen w-full bg-zinc-50">
      <DashboardHeader />

      <div className="w-full px-4 sm:px-10 py-8">
        <div className="mb-6">
          <div className="text-sm text-zinc-500">
            Logged in as: <span className="font-medium">{session.user.email}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/60 backdrop-blur p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">My Tags</h2>
              <p className="mt-1 text-sm text-zinc-600">Open, edit or delete your tags.</p>
            </div>
          </div>

          {tags.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-600">
              No tags yet. Create your first tag.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {tags.map((t) => (
                <TagCard key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}