"use client";

import Link from "next/link";
import React from "react";

type SmartImageProps = {
  alt: string;
  className?: string;
  srcs: string[]; // ordered list of fallbacks
};

function SmartImage({ alt, className, srcs }: SmartImageProps) {
  const [idx, setIdx] = React.useState(0);
  const current = srcs[Math.min(idx, srcs.length - 1)];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        // move to next fallback if available
        setIdx((p) => (p + 1 < srcs.length ? p + 1 : p));
      }}
    />
  );
}

export default function HomePage() {
  const images = {
    hero: [
      // Backpack / travel bag
      "https://images.unsplash.com/photo-1520975682031-a1e4d0b8d6c8?auto=format&fit=crop&w=1800&q=85",
      "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1800&q=85",
    ],
    bags: [
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?auto=format&fit=crop&w=1400&q=85",
    ],
    keys: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/279260/pexels-photo-279260.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1558346547-4439467bd1d5?auto=format&fit=crop&w=1400&q=85",
    ],
    phones: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1510557880182-3f8f8f6d6f26?auto=format&fit=crop&w=1400&q=85",
    ],
    pets: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1400&q=85",
    ],
    laptops: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85",
    ],
    wallets: [
      "https://images.unsplash.com/photo-1622480916113-9000cc3e5d0d?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/273222/pexels-photo-273222.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=85",
    ],
    bottles: [
      "https://images.unsplash.com/photo-1526401485004-2aa7bdb4f55b?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1400&q=85",
    ],
    luggage: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85",
      "https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85",
    ],
  };

  return (
    <main className="w-full min-h-screen bg-white text-zinc-900">
      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* soft background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-zinc-200/40 blur-3xl" />
        </div>

        <div className="relative w-full px-4 sm:px-10 py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Works for bags, phones, keys, pets, laptops
              </div>

              <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
                Stick a <span className="text-emerald-700">QR</span>. <br />
                Get your stuff <span className="text-zinc-500">back</span>.
              </h1>

              <p className="mt-4 text-lg text-zinc-600 max-w-2xl">
                Create a unique QR tag for anything. If someone finds it, they scan and instantly
                contact you — WhatsApp / call / email.
              </p>

              {/* ✅ removed "create" option */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Go to dashboard
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
                >
                  How it works
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-semibold">Unique QR</div>
                  <div className="mt-1 text-sm text-zinc-600">Every item gets its own code.</div>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-semibold">Owner-only edits</div>
                  <div className="mt-1 text-sm text-zinc-600">Only you can update info.</div>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-semibold">Instant contact</div>
                  <div className="mt-1 text-sm text-zinc-600">WhatsApp / Call / Email.</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  No app needed to scan
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Works with any phone camera
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Privacy-friendly contact options
                </span>
              </div>
            </div>

            {/* right */}
            <div className="grid gap-6">
              {/* hero image (with fallbacks) */}
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-zinc-900/10 to-transparent" />
                <SmartImage
                  alt="Travel backpack with QR tag"
                  srcs={images.hero}
                  className="h-64 w-full object-cover sm:h-72"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Scan → Contact → Return
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">Made for real-life “oops” moments</div>
                  <div className="mt-1 text-sm text-white/90">
                    Airports, cafés, campuses, taxis — tags help items find their way home.
                  </div>
                </div>
              </div>

              {/* Example scan page */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-zinc-600">Example scan page</div>
                    <div className="mt-1 text-xs text-zinc-500">What a finder sees after scanning</div>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    SmartTag
                  </span>
                </div>

                <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center font-bold">
                        B
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">Backpack</div>
                        <div className="text-sm text-zinc-500 truncate">If found, contact owner</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                      LOST
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                    Notes: Contains laptop + documents. Please message me if you find it.
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      WhatsApp Owner
                    </button>
                    <button className="w-full rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-semibold shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2">
                      Call Owner
                    </button>
                  </div>

                  <button className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-semibold shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2">
                    Email Owner
                  </button>
                </div>

                <p className="mt-4 text-xs text-zinc-500">
                  Built for quick recovery: scan → contact owner → return item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS FOR EVERYTHING */}
      <section className="w-full bg-white">
        <div className="w-full px-4 sm:px-10 py-14">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Works for everything</h2>
              <p className="mt-2 text-zinc-600">Use SmartTag for daily items — attach and relax.</p>
            </div>

            {/* ✅ removed "Create a tag" option */}
            <Link
              href="/dashboard"
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
            >
              Dashboard
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CardImage title="Bags" desc="Backpacks, handbags, travel bags" tag="Bags" srcs={images.bags} />
            <CardImage title="Keys" desc="Home keys, car keys, lockers" tag="Keys" srcs={images.keys} />
            <CardImage title="Phones" desc="Lost phone? instant contact" tag="Phones" srcs={images.phones} />
            <CardImage title="Pets" desc="Collar tags for dogs & cats" tag="Pets" srcs={images.pets} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CardImage title="Laptops" desc="For work & college devices" tag="Laptops" srcs={images.laptops} />
            <CardImage title="Wallets" desc="Cards, cash, IDs" tag="Wallets" srcs={images.wallets} />
            <CardImage title="Bottles" desc="Gym, office, school" tag="Bottles" srcs={images.bottles} />
            <CardImage title="Luggage" desc="Airport-friendly tags" tag="Luggage" srcs={images.luggage} />
          </div>

          {/* HOW IT WORKS */}
          <div
            id="how-it-works"
            className="mt-14 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold">How it works</h3>
                <p className="mt-2 text-zinc-600">
                  Stick a QR tag on your item. When it’s found, the finder scans and can contact you instantly.
                </p>

                <ol className="mt-6 grid gap-3 text-sm text-zinc-700">
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-bold">
                      1
                    </span>
                    Add your item details + contact options.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-bold">
                      2
                    </span>
                    Attach the QR to your item (bag, phone, keychain, collar).
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-bold">
                      3
                    </span>
                    Finder scans → contacts you → you get your item back.
                  </li>
                </ol>

                {/* ✅ removed create CTA */}
                <div className="mt-6">
                  <Link
                    href="/dashboard"
                    className="inline-flex rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Go to dashboard
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/70 via-white to-sky-100/60" />
                <div className="relative p-6">
                  <div className="text-sm font-semibold text-zinc-900">Contact options</div>
                  <p className="mt-2 text-sm text-zinc-700">
                    Choose what you want to share: WhatsApp, phone call, or email.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="text-sm font-semibold">WhatsApp</div>
                      <div className="mt-1 text-xs text-zinc-600">Fast messaging with one tap</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="text-sm font-semibold">Call</div>
                      <div className="mt-1 text-xs text-zinc-600">Direct phone call option</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="text-sm font-semibold">Email</div>
                      <div className="mt-1 text-xs text-zinc-600">Share an email contact</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ✅ removed the "Tip: If any image doesn’t load..." line */}
        </div>
      </section>
    </main>
  );
}

function CardImage({
  title,
  desc,
  tag,
  srcs,
}: {
  title: string;
  desc: string;
  tag: string;
  srcs: string[];
}) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-zinc-100">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/55 via-zinc-900/10 to-transparent opacity-90" />
        <SmartImage
          alt={title}
          srcs={srcs}
          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-zinc-600">{desc}</div>
      </div>
    </div>
  );
}