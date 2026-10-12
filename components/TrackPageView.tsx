"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TrackPageView() {
  const pathname = usePathname();
  const last = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/gestion-alliance")) return;
    if (last.current === pathname) return;
    last.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/analytics/view",
          new Blob([payload], { type: "application/json" }),
        );
      } else {
        void fetch("/api/analytics/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
