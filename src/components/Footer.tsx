import Link from "next/link";
import { siteContact, siteLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900/70 py-10">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">Kibazzi Kraft</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Corporate photography, events, portraits, and videography in
            Kampala, Uganda.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <Link
                href={siteContact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {siteContact.phone}
              </Link>
            </li>
            <li>{siteContact.email}</li>
            <li>{siteContact.location}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
