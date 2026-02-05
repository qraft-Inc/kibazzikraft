"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="rounded-full border border-zinc-700 p-2 text-zinc-200"
        disabled
      />
    );
  }
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded-full border border-zinc-700 p-2 text-zinc-200 transition hover:border-zinc-500"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
