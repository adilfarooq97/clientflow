import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  display: "optional",
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  display: "optional",
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Souqivo — Client Collaboration Workspace",
    template: "%s | Souqivo",
  },
  description:
    "Souqivo gives freelancers, agencies, and clients one workspace to manage projects, tasks, files, reviews, approvals, messages, and invoices from kickoff to delivery.",
  metadataBase: new URL("https://souqivo.com"),
  applicationName: "Souqivo",
  referrer: "strict-origin-when-cross-origin",
  category: "business",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
