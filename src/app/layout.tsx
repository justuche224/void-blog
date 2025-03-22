import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
  ),
  title: {
    default: "Markdown Blog",
    template: "%s | Markdown Blog",
  },
  description: "A beautiful markdown blog built with Next.js and Drizzle",
  keywords: ["blog", "markdown", "nextjs", "drizzle", "postgres"],
  authors: [{ name: "Blog Author" }],
  creator: "Blog Author",
  publisher: "Markdown Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com",
    title: "Markdown Blog",
    description: "A beautiful markdown blog built with Next.js and Drizzle",
    siteName: "Markdown Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Blog",
    description: "A beautiful markdown blog built with Next.js and Drizzle",
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
