"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = "ko" | "en";

export default function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("ko");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Get current locale from pathname or localStorage
    const pathLocale = pathname.startsWith("/en")
      ? "en"
      : pathname.startsWith("/ko")
      ? "ko"
      : null;
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const initialLocale = pathLocale || savedLocale || "ko";
    setLocale(initialLocale);
  }, [pathname]);

  const toggleLanguage = () => {
    const newLocale: Locale = locale === "ko" ? "en" : "ko";
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);

    // Update URL with new locale
    const currentPath = pathname.replace(/^\/(ko|en)/, "") || "/";
    router.push(`/${newLocale}${currentPath}`);
  };

  if (!mounted) {
    return (
      <div className="w-16 h-9 p-2 rounded-lg">
        <div className="w-12 h-5" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium text-gray-300 hover:text-white"
      aria-label="Toggle language"
    >
      {locale === "ko" ? "🌐 English" : " 🇰🇷 한국어"}
    </button>
  );
}
