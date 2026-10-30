import type { Metadata, Viewport } from "next";
import { Fraunces, Fredoka, Marcellus, Plus_Jakarta_Sans, Yellowtail } from "next/font/google";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus-face",
  subsets: ["latin"],
  weight: "400",
});

const yellowtail = Yellowtail({
  variable: "--font-script-face",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_TAGLINE,
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${fraunces.variable} ${fredoka.variable} ${marcellus.variable} ${yellowtail.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full font-sans">{children}</body>
    </html>
  );
}
