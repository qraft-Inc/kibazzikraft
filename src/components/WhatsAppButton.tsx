import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { siteContact } from "@/data/site";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href={siteContact.whatsappUrl}
        className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-black shadow-lg"
      >
        <PhoneCall size={16} />
        WhatsApp
      </Link>
    </div>
  );
}
