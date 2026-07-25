import { getOrderById } from "@/actions/order-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Commande confirmee — Tech-Assist Dakar",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 size={56} className="mx-auto text-green-600 mb-4" />
      <h1 className="text-2xl font-semibold text-ink mb-2">Commande confirmee !</h1>
      <p className="text-ink-muted mb-6">
        Merci {order.firstName}, votre commande a bien ete enregistree. Notre equipe vous contactera
        au <strong className="text-ink">{order.phone}</strong> pour organiser la livraison.
      </p>

      <div className="bg-white border border-gray-100 rounded-xl p-5 text-left mb-6">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-ink-muted">Reference</span>
          <span className="font-medium text-ink">{order.reference}</span>
        </div>
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink-muted">{item.productName} × {item.quantity}</span>
              <span className="text-ink">{(Number(item.unitPrice) * item.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold pt-3 border-t border-gray-100">
          <span className="text-ink">Total</span>
          <span className="text-primary">{Number(order.totalAmount).toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-ink-muted">
          <p>Livraison : {order.address}, {order.city}</p>
        </div>
      </div>

      <Link
        href="/produits"
        className="inline-block bg-primary hover:bg-primary-dark text-white rounded-lg px-6 py-3 text-sm font-medium transition"
      >
        Continuer mes achats
      </Link>
    </div>
  );
}
