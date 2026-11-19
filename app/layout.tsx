import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceBack | Campus & Community Lost & Found",
  description: "Report, search, match and recover lost and found belongings effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
