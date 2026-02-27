import Link from "next/link";
import NewTagForm from "./NewTagForm";

export default function NewTagPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-zinc-50">
      <div className="w-full px-4 sm:px-10 py-8">
        {/* Page top row (not a second header) */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            ← Back
          </Link>
          <div>
            <div className="text-lg font-semibold">Create Tag</div>
            <div className="text-sm text-zinc-500">Make a new QR tag</div>
          </div>
        </div>

        <NewTagForm />
      </div>
    </main>
  );
}