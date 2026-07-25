import CartView from "@/components/shop/CartView";

export const metadata = {
  title: "Mon panier — Tech-Assist Dakar",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-ink mb-6">Mon panier</h1>
      <CartView />
    </div>
  );
}
