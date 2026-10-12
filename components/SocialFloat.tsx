"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { useSiteContent } from "@/components/SiteContentProvider";
import WhatsAppLink from "@/components/WhatsAppLink";
import { facebookMessengerUrlFrom } from "@/lib/site-content";

function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export default function SocialFloat() {
  const { contact } = useSiteContent();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white"
        aria-label="Masquer les boutons de messagerie"
      >
        <X size={14} />
      </button>
      <div className="flex flex-col gap-2.5 rounded-2xl border border-mist bg-white/95 p-2 shadow-hover">
        <a
          href={facebookMessengerUrlFrom(contact.facebookPageId)}
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2] text-white"
          aria-label="Écrire sur Facebook Messenger"
          title="Messagerie Facebook"
        >
          <FacebookIcon size={20} />
        </a>
        <WhatsAppLink
          phone={contact.whatsapp}
          className="float-btn flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white"
          aria-label="Écrire sur WhatsApp"
          title="Messagerie WhatsApp"
        >
          <MessageCircle size={22} />
        </WhatsAppLink>
      </div>
    </div>
  );
}
