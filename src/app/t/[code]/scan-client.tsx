"use client";

import { useMemo, useState } from "react";
import { Phone, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

type TagDTO = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  photoUrl: string | null;
  ownerName: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export default function ScanClient({ tag }: { tag: TagDTO }) {
  const [sending, setSending] = useState(false);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const whatsappNumber = useMemo(() => {
    // If whatsapp not set, fallback to phone
    const n = (tag.whatsapp || tag.phone || "").replace(/[^\d+]/g, "");
    return n.startsWith("+") ? n.replace("+", "") : n;
  }, [tag.whatsapp, tag.phone]);

  const callNumber = useMemo(() => {
    const n = (tag.phone || tag.whatsapp || "").replace(/[^\d+]/g, "");
    return n;
  }, [tag.phone, tag.whatsapp]);

  async function shareLocationAndOpenWhatsApp() {
    setError(null);
    setSending(true);

    try {
      const coords = await new Promise<{ lat: number; lng: number }>((res, rej) => {
        if (!navigator.geolocation) return rej(new Error("Geolocation not supported"));
        navigator.geolocation.getCurrentPosition(
          (pos) => res({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => rej(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      setLoc(coords);

      const maps = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
      const msg =
        `Hi! I found your "${tag.title}".\n` +
        `My location: ${maps}\n` +
        `Please contact me.`;

      // Save scan event in DB
      await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagId: tag.id,
          message: msg,
          lat: coords.lat,
          lng: coords.lng,
        }),
      });

      // Open WhatsApp with prefilled message
      if (!whatsappNumber) {
        setError("Owner WhatsApp/Phone is not set.");
        return;
      }

      const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(wa, "_blank");
    } catch (e: any) {
      setError(e?.message || "Could not get location. Please allow location permission.");
    } finally {
      setSending(false);
    }
  }

  const mapsPreview = loc
    ? `https://maps.google.com/?q=${loc.lat},${loc.lng}`
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-white">
      <div className="mx-auto max-w-md px-5 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-700">Lost item found!</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified Tag
          </div>
        </div>

        {/* Card */}
        <div className="mt-4 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          {/* Header image */}
          <div className="bg-gradient-to-r from-emerald-50 to-sky-50 px-5 py-5">
            <div className="flex gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                {tag.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tag.photoUrl} alt={tag.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-lg font-semibold text-emerald-700">
                    {tag.title?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-xl font-semibold text-zinc-900">{tag.title}</div>
                <div className="mt-1 text-sm text-zinc-600">
                  {tag.ownerName ? `Owner: ${tag.ownerName}` : "Owner contact below"}
                </div>
                {tag.description ? (
                  <div className="mt-2 line-clamp-3 text-sm text-zinc-700">
                    {tag.description}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-zinc-700">
                    Please contact the owner if you found this item.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 pt-4">
            <div className="grid gap-3">
              <button
                onClick={() => {
                  if (!callNumber) return setError("Owner phone number is not set.");
                  window.location.href = `tel:${callNumber}`;
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Phone className="h-4 w-4" />
                Call Owner
              </button>

              <button
                onClick={shareLocationAndOpenWhatsApp}
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-70"
              >
                <MessageCircle className="h-4 w-4" />
                {sending ? "Sharing location..." : "WhatsApp Owner (send location)"}
              </button>

              {/* Location preview */}
              <div className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <MapPin className="h-4 w-4 text-zinc-600" />
                  Location
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  {mapsPreview ? (
                    <a className="text-blue-600 underline" href={mapsPreview} target="_blank">
                      Open your location in Maps
                    </a>
                  ) : (
                    "Tap WhatsApp to share your location."
                  )}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-zinc-500">
          Tag Code: <span className="font-mono">{tag.code}</span>
        </div>
      </div>
    </main>
  );
}