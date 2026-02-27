import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SmartTag",
  description: "Lost & Found QR tags for anything",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-white text-zinc-900">
        <Navbar />

        {/* Full-width app */}
        <main className="w-full min-h-[calc(100vh-64px)]">{children}</main>

        <footer className="w-full border-t border-zinc-200 bg-white">
          <div className="w-full px-4 sm:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-sm text-zinc-600">
              © 2026 Smart Tag
            </div>
            <div className="text-sm text-zinc-600">
              Created by <span className="font-semibold text-zinc-900">Lakshita Sah</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}