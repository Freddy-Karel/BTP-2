"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { openWhatsApp } from "@/lib/site-content";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  phone: string;
  message?: string;
};

/** Lien WhatsApp : ouvre l’app (whatsapp://) puis bascule sur le web si besoin */
export default function WhatsAppLink({
  phone,
  message = "Bonjour ALLIANCE M.O BTP, je souhaite des informations sur vos services.",
  children,
  ...rest
}: Props) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openWhatsApp(phone, message);
  };

  return (
    <a href={`whatsapp://send?phone=${phone.replace(/\D/g, "")}`} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
