import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kibazzi Kraft | Kampala Corporate & Event Photography",
  description:
    "Kibazzi Kraft is a Kampala-based studio specializing in corporate, events, portraits, and videography.",
  openGraph: {
    title: "Kibazzi Kraft",
    description:
      "Corporate photography, events, portraits, and videography in Kampala, Uganda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
