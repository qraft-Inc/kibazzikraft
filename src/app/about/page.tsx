import Section from "@/components/Section";
import { siteContact } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      <Section title="About Kibazzi Kraft">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm text-zinc-300">
            <p>
              Founded in 2016, Kibazzi Kraft has become a trusted partner
              for Kampala-based businesses, NGOs, and events teams. We capture
              brand moments with premium visuals and authentic storytelling.
            </p>
            <p>
              Our studio is led by Pius Kibazzi and a small team of creatives who
              specialize in corporate events, portraits, and video production.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="mt-2 text-sm text-zinc-300">
              <a
                href={siteContact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {siteContact.phone}
              </a>
            </p>
            <p className="text-sm text-zinc-300">{siteContact.email}</p>
            <p className="text-sm text-zinc-300">{siteContact.location}</p>
          </div>
        </div>
      </Section>

      <Section title="Timeline">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              year: "2016",
              text: "Studio founded in Kampala, focusing on corporate photography.",
            },
            {
              year: "2020",
              text: "Expanded into NGO storytelling and event videography.",
            },
            {
              year: "2024",
              text: "Delivered 250+ projects for East African brands.",
            },
          ].map((item) => (
            <div key={item.year} className="card">
              <p className="text-sm text-accent-500">{item.year}</p>
              <p className="mt-2 text-sm text-zinc-300">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
