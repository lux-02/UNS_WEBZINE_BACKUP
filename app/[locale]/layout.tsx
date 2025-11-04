import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "UNs 2025 | Peace Connects Us",
  description: "2025 Busan UNs Digital Hub - Official archive and community platform documenting our journey towards peace and global understanding.",
  keywords: ["UNs", "Busan", "Peace", "Youth", "Global", "UN", "Supporters"],
  authors: [{ name: "Busan UNs Supporters" }],
  openGraph: {
    title: "UNs 2025 | Peace Connects Us",
    description: "Official archive and community platform for 2025 Busan UNs activities",
    type: "website",
  },
};

const locales = ["ko", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className="min-h-screen flex flex-col bg-gray-900">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
