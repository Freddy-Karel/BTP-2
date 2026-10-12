"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DRAG_THRESHOLD = 8;

type Props = {
  children: ReactNode;
  className?: string;
  /** Label accessibilité */
  label?: string;
};

/**
 * Bandeau horizontal glissable + flèches (même logique que le carrousel Clients).
 */
export default function CatalogStrip({
  children,
  className = "",
  label = "Galerie horizontale",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const drag = useRef({
    active: false,
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null as number | null,
  });

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, children]);

  const scrollBy = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.min(320, el.clientWidth * 0.75);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Faire défiler vers la gauche"
        disabled={!canPrev}
        onClick={() => scrollBy(-1)}
        className="absolute left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/15 bg-navy/80 text-white backdrop-blur-sm transition hover:bg-navy disabled:pointer-events-none disabled:opacity-0 md:left-2 md:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Faire défiler vers la droite"
        disabled={!canNext}
        onClick={() => scrollBy(1)}
        className="absolute right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/15 bg-navy/80 text-white backdrop-blur-sm transition hover:bg-navy disabled:pointer-events-none disabled:opacity-0 md:right-2 md:flex"
      >
        <ChevronRight size={18} />
      </button>

      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="catalog-strip flex gap-4 overflow-x-auto px-4 py-1 md:px-6"
        onPointerDown={(e) => {
          const el = ref.current;
          if (!el || e.button !== 0) return;
          drag.current = {
            active: true,
            dragging: false,
            startX: e.clientX,
            scrollLeft: el.scrollLeft,
            pointerId: e.pointerId,
          };
        }}
        onPointerMove={(e) => {
          const el = ref.current;
          const d = drag.current;
          if (!el || !d.active) return;
          const dx = e.clientX - d.startX;
          if (!d.dragging && Math.abs(dx) > DRAG_THRESHOLD) {
            d.dragging = true;
            el.classList.add("is-dragging");
            try {
              el.setPointerCapture(d.pointerId!);
            } catch {
              /* ignore */
            }
          }
          if (d.dragging) {
            el.scrollLeft = d.scrollLeft - dx;
          }
        }}
        onPointerUp={() => {
          const el = ref.current;
          const d = drag.current;
          if (el) el.classList.remove("is-dragging");
          if (d.dragging) {
            const suppress = (ev: Event) => {
              ev.stopPropagation();
              ev.preventDefault();
              el?.removeEventListener("click", suppress, true);
            };
            el?.addEventListener("click", suppress, true);
            window.setTimeout(
              () => el?.removeEventListener("click", suppress, true),
              0,
            );
          }
          drag.current.active = false;
          drag.current.dragging = false;
          drag.current.pointerId = null;
        }}
        onPointerCancel={() => {
          ref.current?.classList.remove("is-dragging");
          drag.current.active = false;
          drag.current.dragging = false;
        }}
        onPointerLeave={() => {
          if (!drag.current.dragging) {
            drag.current.active = false;
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
