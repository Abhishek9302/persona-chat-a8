import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A8 Persona Chat",
  description: "Persona Chat proof app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
