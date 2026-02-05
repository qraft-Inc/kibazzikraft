import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import { siteContact } from "@/data/site";

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-20">
      <Section
        title="Contact"
        subtitle="Tell us about your event or corporate shoot."
      >
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4 text-sm text-zinc-300">
            <p>Reach out for bookings, quotes, or collaboration inquiries.</p>
            <div className="card">
              <p>
                <a
                  href={siteContact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {siteContact.phone}
                </a>
              </p>
              <p>{siteContact.email}</p>
              <p>{siteContact.location}</p>
              <p className="mt-2 text-zinc-500">Instagram {siteContact.instagram}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-4 text-xs text-zinc-400">
              Map embed placeholder — add Google Maps iframe for Kampala.
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </div>
  );
}
