import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Gallery from "@/components/Gallery";
import { featuredPhotos } from "@/data/galleries";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteContact } from "@/data/site";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />

      <Section
        title="Featured Work"
        subtitle="Corporate moments, events, and portraits that tell your story."
      >
        <Gallery photos={featuredPhotos} />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/portfolio" className="btn-primary w-full sm:w-auto">
            View Full Portfolio
          </Link>
          <Link
            href={siteContact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-full sm:w-auto"
          >
            Book Now
          </Link>
        </div>
      </Section>

      <Section
        title="Why Kibazzi Kraft"
        subtitle="Trusted by growing businesses and NGOs in Kampala."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Fast turnaround",
              copy: "Same-week delivery for most corporate events and launches.",
            },
            {
              title: "Story-driven visuals",
              copy: "We capture people, brand moments, and authentic narratives.",
            },
            {
              title: "Multi-format delivery",
              copy: "Optimized files for print, web, social, and reports.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{item.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Client Stories">
        <Testimonials />
      </Section>

      <WhatsAppButton />
    </div>
  );
}
