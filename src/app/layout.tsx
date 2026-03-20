import type { Metadata } from "next";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Sokolova",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
