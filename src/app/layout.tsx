import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { clinic } from "@/content/clinic";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { themeInitScript } from "@/lib/theme/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${clinic.fullName} · Fogorvos Szegeden`;
const description =
  "Prémium magánfogászat Szeged belvárosában: általános és esztétikai fogászat, fogfehérítés, implantológia, fogszabályozás és szájhigiénia. Foglaljon időpontot online.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed domain so share images resolve absolutely.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lume-fogaszat.example"),
  title,
  description,
  applicationName: clinic.fullName,
  keywords: ["fogorvos Szeged", "fogászat Szeged", "implantátum", "fogfehérítés", "fogszabályozás", "esztétikai fogászat"],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "hu_HU",
    siteName: clinic.fullName,
    images: [{ url: "/images/treatment-room-960.jpg", width: 960, height: 1433, alt: "Világos, modern kezelőhelyiség" }],
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f2",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: clinic.fullName,
  address: {
    "@type": "PostalAddress",
    streetAddress: clinic.street,
    addressLocality: clinic.city,
    addressCountry: "HU",
  },
  email: clinic.email,
  openingHours: ["Mo-Th 07:30-19:30", "Fr 07:30-16:00", "Sa 09:00-13:00"],
  medicalSpecialty: "Dentistry",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hu" data-theme="light" data-appearance="system" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#tartalom">
          Ugrás a tartalomhoz
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
