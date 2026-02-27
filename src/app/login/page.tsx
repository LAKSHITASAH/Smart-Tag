"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res?.ok) {
      setErr("Invalid email or password");
      return;
    }

    r.push("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-zinc-50">
      <div className="w-full px-4 sm:px-10 py-10">
        {/* Full-width container with centered card */}
        <div className="w-full grid place-items-center">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="mt-1 text-sm text-zinc-600">Access your tags.</p>

            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              <input
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {err ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {err}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-sm text-zinc-600">
                New here?{" "}
                <Link className="text-emerald-700 underline" href="/signup">
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}