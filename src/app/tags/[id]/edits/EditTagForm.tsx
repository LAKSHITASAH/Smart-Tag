"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

type TagData = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  ownerName: string | null;
  phone: string | null;
  whatsapp: string | null;
  imageUrl: string | null;
};

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary env missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.secure_url as string;
}

export default function EditTagForm({ initialTag }: { initialTag: TagData }) {
  const router = useRouter();
  const qrWrapRef = useRef<HTMLDivElement | null>(null);

  const [title, setTitle] = useState(initialTag.title || "");
  const [description, setDescription] = useState(initialTag.description || "");
  const [ownerName, setOwnerName] = useState(initialTag.ownerName || "");
  const [phone, setPhone] = useState(initialTag.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialTag.whatsapp || "");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined")
      return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }, []);

  const qrValue = `${baseUrl}/t/${initialTag.code}`;

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // If new file uploaded -> upload and use new url, else keep existing
      let imageUrl: string | null = initialTag.imageUrl || null;

      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(file);
        setUploading(false);
      }

      const res = await fetch(`/api/tags/${initialTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          ownerName: ownerName.trim() || null,
          phone: phone.trim() || null,
          whatsapp: whatsapp.trim() || null,
          imageUrl,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to update tag");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setUploading(false);
    } finally {
      setLoading(false);
    }
  }

  function downloadQrPng() {
    const canvas = qrWrapRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `${title || "tag"}-${initialTag.code}.png`;
    a.click();
  }

  return (
    <div className="w-full px-4 sm:px-10 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[520px,1fr]">
          {/* LEFT: FORM */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight">Edit tag</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Update details so someone can contact you and return the item.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Item title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
                  placeholder="e.g. Backpack / Dog / Keys"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[100px] w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
                  placeholder="How to identify it, reward, etc."
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Item photo</label>
                <div className="mt-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPickFile}
                    className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-white hover:file:bg-zinc-800"
                  />

                  {/* Show new preview, else existing image */}
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-4 h-44 w-full rounded-2xl object-cover border border-zinc-200 bg-white"
                    />
                  ) : initialTag.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={initialTag.imageUrl}
                      alt="Current"
                      className="mt-4 h-44 w-full rounded-2xl object-cover border border-zinc-200 bg-white"
                    />
                  ) : (
                    <div className="mt-3 text-xs text-zinc-500">
                      No photo yet. Upload a clear image.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Owner name</label>
                  <input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">WhatsApp</label>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
                  placeholder="+91..."
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                disabled={loading || uploading}
                className="w-full rounded-2xl bg-zinc-900 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
              >
                {uploading ? "Uploading photo…" : loading ? "Saving…" : "Save changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-2xl border border-zinc-200 py-3 text-sm font-medium hover:bg-zinc-50"
              >
                Cancel
              </button>
            </form>
          </div>

          {/* RIGHT: QR */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">QR Preview</h2>
                <p className="mt-1 text-sm text-zinc-500">Print this QR and attach it.</p>
              </div>

              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                Code: {initialTag.code}
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div
                ref={qrWrapRef}
                className="flex min-h-[260px] items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50 p-6"
              >
                <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <QRCodeCanvas value={qrValue} size={210} includeMargin />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-zinc-200 p-4">
                  <div className="text-xs text-zinc-500">Scan URL</div>
                  <div className="mt-1 break-all font-mono text-sm">{qrValue}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={downloadQrPng}
                      className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                      Download PNG
                    </button>

                    <a
                      href={qrValue}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                    >
                      Open
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                  Tip: Use a clear photo so the finder can confirm it.
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-zinc-500">
              QR works for everyone only after deploy (localhost is not public).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}