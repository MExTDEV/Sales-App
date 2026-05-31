import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awareness",
  description: "Internal phishing awareness campaign planner"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
