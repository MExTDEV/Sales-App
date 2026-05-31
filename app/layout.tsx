import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "M.Ex.T. Sales App",
    template: "%s | M.Ex.T. Sales App"
  },
  description:
    "Phase 4.1 architecture cleanup and stabilization for the internal M.Ex.T. Sales App.",
  applicationName: "M.Ex.T. Sales App",
  openGraph: {
    title: "M.Ex.T. Sales App",
    description: "Internal offline-first sales app architecture cleanup and stabilization.",
    siteName: "M.Ex.T. Sales App",
    locale: "nl_BE",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#003B83",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl-BE">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
