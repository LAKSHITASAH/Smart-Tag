import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function ScanPage(
  props: { params: Promise<{ code: string }> } // ✅ Next 16 dynamic params are async
) {
  const { code } = await props.params;

  if (!code) notFound();

  const tag = await prisma.tag.findUnique({
    where: { code },
    include: { user: true },
  });

  if (!tag) {
    return (
      <main className="min-h-[calc(100vh-64px)] grid place-items-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold">Tag not found</div>
          <p className="mt-2 text-zinc-600">This QR code doesn’t exist.</p>
        </div>
      </main>
    );
  }

  // ✅ Record scan (does NOT change UI logic)
  // We do it safely and never crash page if scan logging fails.
  try {
    const h = await headers();
    const forwardedFor = h.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

    await prisma.scan.create({
      data: {
        tagId: tag.id,
        ip,
        userAgent: h.get("user-agent"),
        referer: h.get("referer"),
      },
    });
  } catch {
    // ignore scan failures
  }

  const ownerDisplay = tag.ownerName || tag.user.name || "Owner";

  const whatsappLink = tag.whatsapp
    ? `https://wa.me/${tag.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        `Hi! I found your item "${tag.title}".`
      )}`
    : null;

  const callLink = tag.phone ? `tel:${tag.phone}` : null;

  const emailLink = `mailto:${tag.user.email}?subject=${encodeURIComponent(
    `I found your item (${tag.title})`
  )}&body=${encodeURIComponent(
    `Hi! I found your item "${tag.title}". Tag code: ${tag.code}`
  )}`;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-zinc-50 via-white to-white px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-500">Lost item found</div>

          <div className="mt-2 text-2xl font-semibold">{tag.title}</div>
          <div className="mt-1 text-zinc-600">{tag.description || "No notes"}</div>

          {tag.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tag.imageUrl}
              alt={tag.title}
              className="mt-4 h-44 w-full rounded-2xl object-cover border border-zinc-200"
            />
          )}

          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Owner</div>
            <div className="mt-1 font-semibold">{ownerDisplay}</div>
            <div className="text-sm text-zinc-600">Email: {tag.user.email}</div>
          </div>

          <div className="mt-5 grid gap-3">
            {whatsappLink && (
              <a
                href={whatsappLink}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-emerald-700"
              >
                WhatsApp owner
              </a>
            )}

            {callLink && (
              <a
                href={callLink}
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-center text-sm font-medium hover:bg-zinc-50"
              >
                Call owner
              </a>
            )}

            <a
              href={emailLink}
              className="rounded-2xl border border-zinc-200 px-4 py-3 text-center text-sm font-medium hover:bg-zinc-50"
            >
              Email owner
            </a>
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Code: <span className="font-mono">{tag.code}</span>
          </div>
        </div>
      </div>
    </main>
  );
}