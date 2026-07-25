import CheckoutForm from "@/components/shop/CheckoutForm";

export const metadata = {
  title: "Finaliser ma commande — Tech-Assist Dakar",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-ink mb-6">Finaliser ma commande</h1>
      <CheckoutForm />
    </div>
  );
}
