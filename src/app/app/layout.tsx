import type { Metadata, Viewport } from "next";
import { RegisterSW } from "@/components/app/RegisterSW";

// Só esta área tem o manifest do PWA: o ícone instalado abre direto em /app,
// sem passar pelo site.
export const metadata: Metadata = {
  title: "App da aluna",
  manifest: "/app/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Jaque Ruas", statusBarStyle: "black-translucent" },
  icons: {
    icon: "/app/icon-192.png",
    apple: "/app/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-dark className="min-h-dvh bg-[var(--page)] text-[var(--text)]">
      <div className="mx-auto min-h-dvh max-w-[480px]">{children}</div>
      <RegisterSW />
    </div>
  );
}
