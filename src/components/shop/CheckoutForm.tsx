"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/order-actions";
import { useCartStore } from "@/store/cart-store";

const villesSenegal = [
  "Dakar", "Pikine", "Guediawaye", "Rufisque", "Thies", "Mbour",
  "Saint-Louis", "Touba", "Kaolack", "Ziguinchor", "Diourbel", "Louga", "Autre",
];

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dakar");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (hydrated && items.length === 0) {
    router.push("/panier");
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createOrder({
        firstName,
        lastName,
        phone,
        address,
        city,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        clearCart();
        router.push(`/commande/confirmation/${result.orderId}`);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink-muted mb-1">Numero de telephone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 123 45 67"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-ink-muted mb-1">Adresse de livraison</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, rue, repere..."
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-ink-muted mb-1">Ville</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {villesSenegal.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3 text-sm font-medium transition disabled:opacity-60"
        >
          {isPending ? "Traitement en cours..." : "Confirmer la commande"}
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-xl p-5 h-fit">
        <h2 className="font-medium text-ink mb-4">Votre commande</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-ink-muted">
                {item.name} × {item.quantity}
              </span>
              <span className="text-ink font-medium">
                {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between font-semibold text-ink pt-3 border-t border-gray-100">
          <span>Total</span>
          <span className="text-primary">{total().toLocaleString("fr-FR")} FCFA</span>
        </div>
        <p className="text-xs text-ink-muted mt-3">Paiement a la livraison.</p>
      </div>
    </div>
  );
}
