import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { getPublicCategories } from "@/actions/shop-actions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techassistdakar.com";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await getPublicCategories();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tech-Assist Dakar",
    url: siteUrl,
    logo: `${siteUrl}/logo/logo-tech-assist.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Header categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
