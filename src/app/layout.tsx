import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techassistdakar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tech-Assist Dakar — Ordinateurs, Smartphones & Accessoires Informatiques",
    template: "%s",
  },
  description:
    "Boutique en ligne d'electronique a Dakar : ordinateurs, smartphones, disques durs, montres connectees, ecouteurs et bien plus. Livraison rapide au Senegal.",
  keywords: [
    "matériel informatique Dakar",
    "électronique Dakar",
    "ordinateur portable Sénégal",
    "smartphone Dakar",
    "montre connectée Sénégal",
    "écouteurs sans fil Dakar",
    "disque dur externe Sénégal",
    "Tech-Assist Dakar",
  ],
  authors: [{ name: "Tech-Assist Dakar" }],
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: "Tech-Assist Dakar",
    title: "Tech-Assist Dakar — Matériel électronique et informatique à Dakar",
    description:
      "Ordinateurs, smartphones, montres connectées, écouteurs, disques durs, accessoires et plus. Livraison rapide au Sénégal.",
    images: [
      {
        url: "/logo/logo-tech-assist.png",
        width: 1000,
        height: 1000,
        alt: "Tech-Assist Dakar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech-Assist Dakar",
    description: "Matériel électronique et informatique à Dakar — Livraison rapide.",
    images: ["/logo/logo-tech-assist.png"],
  },
  icons: {
    icon: "/logo/logo-tech-assist.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-surface text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}