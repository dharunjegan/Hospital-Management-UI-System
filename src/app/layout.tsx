import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hospital Management System",
  description:
    "A modern Hospital Management System built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui for efficient healthcare administration.",
  keywords: [
    "Hospital Management System",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Healthcare App",
    "React",
    "shadcn/ui",
  ],
  authors: [{ name: "Your Name" }], // Replace with your actual name
  openGraph: {
    title: "Hospital Management System",
    description:
      "Efficient and modern hospital management platform built with Next.js and TypeScript.",
    url: "https://yourwebsite.com", // Replace with your deployed URL
    siteName: "Hospital Management System",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Management System",
    description:
      "Modern healthcare administration system built using Next.js and TypeScript.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
