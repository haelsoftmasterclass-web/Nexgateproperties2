import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/content/JsonLd";
import { MotionProvider, motionBootScript } from "@/components/motion/MotionProvider";
import { getSiteSettings } from "@/lib/api";
import { telHref } from "@/lib/format";
import { SERVICES } from "@/lib/services";
import { PROPERTY_NAV, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Real Estate in Nigeria and Beyond`, template: `%s | ${SITE_NAME}` },
  description:
    "Nexgate Properties, part of Nexgate Group, helps clients find, develop, invest in and manage residential and commercial property in Nigeria and internationally.",
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: "en_NG", type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#B01F31" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const firstPhone = settings.phone_numbers.find((p) => telHref(p.number_e164));
  const serviceNav = SERVICES.map((s) => ({ label: s.navLabel, href: s.href, description: s.short }));

  const organization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/nexgate-properties-logo.png`,
    parentOrganization: { "@type": "Organization", name: "Nexgate Group" },
    // Contact details are only published in structured data once management has confirmed them.
    ...(settings.contact_details_confirmed
      ? {
          email: settings.primary_email || undefined,
          telephone: firstPhone?.number_e164,
          address: settings.offices.filter((o) => o.address_verified).map((o) => ({ "@type": "PostalAddress", streetAddress: o.address, addressCountry: o.country })),
          sameAs: settings.social_links.map((s) => s.url),
        }
      : {}),
  };

  return (
    <html lang="en-NG" className={`${manrope.variable} ${instrument.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-clip">
        <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <JsonLd data={organization} />
        <AnnouncementBar />
        <Header
          propertyNav={PROPERTY_NAV}
          serviceNav={serviceNav}
          phone={firstPhone ? { href: telHref(firstPhone.number_e164)!, display: firstPhone.display } : null}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <WhatsAppButton number={settings.whatsapp_number} />
        <MotionProvider />
      </body>
    </html>
  );
}
