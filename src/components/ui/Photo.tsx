import type { ImgHTMLAttributes } from "react";

/**
 * Responsive photo from /public/images. Each photo ships as -500/-960(/-1280).jpg,
 * so the browser picks the right file for the slot (static export, no optimizer).
 */
const SIZES: Record<string, readonly number[]> = {
  "treatment-room": [500, 960],
  instruments: [500, 960],
  portrait: [500, 960],
  whitening: [500, 960, 1280],
  "curing-light": [500, 960, 1280],
  procedure: [500, 960, 1280],
  "dom-ter": [500, 960, 1280],
};

const RATIO: Record<string, number> = {
  "treatment-room": 1433 / 960,
  instruments: 1433 / 960,
  portrait: 1440 / 960,
  whitening: 853 / 1280,
  "curing-light": 853 / 1280,
  procedure: 853 / 1280,
  "dom-ter": 720 / 1280,
};

export type PhotoName = keyof typeof SIZES;

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  name: PhotoName;
  alt: string;
  sizes: string;
  priority?: boolean;
}

export function Photo({ name, alt, sizes, priority, className, ...rest }: Props) {
  const widths = SIZES[name];
  const largest = widths[widths.length - 1];
  return (
    <img
      src={`/images/${name}-${largest}.jpg`}
      srcSet={widths.map((w) => `/images/${name}-${w}.jpg ${w}w`).join(", ")}
      sizes={sizes}
      width={largest}
      height={Math.round(largest * RATIO[name])}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
