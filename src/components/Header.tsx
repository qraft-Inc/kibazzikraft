"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { siteContact, siteLinks } from "@/data/site";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/70 bg-zinc-950/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Kibazzi Kraft logo"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-lg font-semibold tracking-wide">
            Kibazzi Kraft
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full border border-zinc-700 p-2 text-zinc-200 transition hover:border-zinc-500 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link
            href={siteContact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Book Now
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <div
        className={`md:hidden ${
          isOpen ? "max-h-96 border-t border-zinc-900/70" : "max-h-0"
        } overflow-hidden bg-zinc-950/95 transition-all`}
      >
        <div className="container flex flex-col gap-4 py-4">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300 transition hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={siteContact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-fit"
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
