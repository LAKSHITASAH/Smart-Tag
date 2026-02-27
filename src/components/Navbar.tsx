import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  return (
    <header className="w-full sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="w-full px-4 sm:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-bold">
            ST
          </div>
          <div className="leading-tight">
            <div className="font-semibold">SmartTag</div>
            <div className="text-xs text-zinc-500">Lost & Found QR tags</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
            >
              Login
            </Link>
          )}

          <Link
            href={isLoggedIn ? "/dashboard/new" : "/signup"}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}