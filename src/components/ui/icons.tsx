import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const SunIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
  </svg>
);

export const SystemIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="4" width="18" height="12.5" rx="2.2" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </svg>
);

export const ArrowRight = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} className="arrow" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronDown = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeft = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2.2} {...p}>
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

export const CloseIcon = ({ size = 12, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2.4} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CalendarIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const ClockIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const PinIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const MailIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const PhoneIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6A2.1 2.1 0 0 1 18.4 20 15.9 15.9 0 0 1 4 5.6a2.1 2.1 0 0 1 2.6-2.1Z" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SparkleIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" />
    <path d="M18.5 16.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" />
  </svg>
);

export const ShieldIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);

/** Brand mark: a soft crescent of light over a tooth-like arch. */
export const LumeMark = ({ size = 28, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable={false} {...p}>
    <defs>
      <linearGradient id="lume-g" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#8fb3f2" />
        <stop offset="1" stopColor="#2f63b8" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" fill="url(#lume-g)" />
    <path
      d="M10 11.5c0-2.2 1.7-3.5 3.6-3.5 1 0 1.7.4 2.4.4s1.4-.4 2.4-.4c1.9 0 3.6 1.3 3.6 3.5 0 3.2-1.2 4.4-1.6 7.6-.3 2.6-.9 4.9-2.2 4.9-1.4 0-1.3-4.6-2.2-4.6s-.8 4.6-2.2 4.6c-1.3 0-1.9-2.3-2.2-4.9-.4-3.2-1.6-4.4-1.6-7.6Z"
      fill="#fff"
    />
  </svg>
);
