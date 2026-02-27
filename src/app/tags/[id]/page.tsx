import Link from "next/link";

type PageProps = {
  params: { id: string };
};

export default async function TagPage({ params }: PageProps) {
  const { id } = params;

  // TODO: Replace this with your real DB fetch if needed
  // Example:
  // const tag = await prisma.tag.findUnique({ where: { id } });

  return (
    <main className="min-h-screen bg-white px-4 sm:px-10 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">Tag</h1>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-600">Tag ID</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900 break-all">{id}</div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            This is a placeholder page so your build works.
            <br />
            Next step: fetch tag data from DB using Prisma and render it here.
          </div>
        </div>
      </div>
    </main>
  );
}