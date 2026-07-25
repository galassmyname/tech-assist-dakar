import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-primary mb-5 transition"
      >
        <ArrowLeft size={16} /> Retour aux commandes
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{order.reference}</h1>
          <p className="text-sm text-ink-muted">
            Passee le {order.createdAt.toLocaleDateString("fr-FR", {
              day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="font-medium text-ink text-sm mb-3">Informations client</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Nom complet</dt>
              <dd className="text-ink font-medium">{order.firstName} {order.lastName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Telephone</dt>
              <dd className="text-ink font-medium">{order.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="font-medium text-ink text-sm mb-3">Livraison</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Adresse</dt>
              <dd className="text-ink font-medium text-right">{order.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Ville</dt>
              <dd className="text-ink font-medium">{order.city}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h2 className="font-medium text-ink text-sm mb-4">Articles commandes</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 text-sm">
              <div>
                <p className="text-ink font-medium">{item.productName}</p>
                <p className="text-xs text-ink-muted">
                  {Number(item.unitPrice).toLocaleString("fr-FR")} FCFA × {item.quantity}
                </p>
              </div>
              <p className="text-ink font-medium">
                {(Number(item.unitPrice) * item.quantity).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
          <span className="font-semibold text-ink">Total</span>
          <span className="font-semibold text-primary text-lg">
            {Number(order.totalAmount).toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}
