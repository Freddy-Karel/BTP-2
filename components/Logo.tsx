"use client";

import Image from "next/image";

type Variant = "full" | "full-light" | "mark" | "mark-light";

const SRC: Record<Variant, string> = {
  full: "/brand/logo-full.png",
  "full-light": "/brand/logo-full-light.png",
  mark: "/brand/logo-mark.png",
  "mark-light": "/brand/logo-mark-light.png",
};

/** Ratio natif des PNG /brand */
const ASPECT: Record<Variant, number> = {
  full: 817 / 358,
  "full-light": 817 / 358,
  mark: 1,
  "mark-light": 1,
};

type Props = {
  variant?: Variant;
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Logo PNG officiel — proportions figées (pas d’écrasement) */
export default function Logo({
  variant = "full",
  height = 40,
  className = "",
  priority = false,
}: Props) {
  const width = Math.round(height * ASPECT[variant]);

  return (
    <Image
      src={SRC[variant]}
      alt="ALLIANCE M.O BTP"
      width={width}
      height={height}
      priority={priority}
      className={`select-none object-contain ${className}`}
      style={{ width, height, maxWidth: "none", flexShrink: 0 }}
    />
  );
}
