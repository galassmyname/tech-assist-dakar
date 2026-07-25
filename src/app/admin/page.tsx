import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "EN_ATTENTE" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Produits", value: productCount },
    { label: "Commandes totales", value: orderCount },
    { label: "En attente", value: pendingCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-ink-muted mb-1">{s.label}</p>
            <p className="text-3xl font-semibold text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-ink">Dernieres commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-primary font-medium hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/commandes/${o.id}`}
              className="flex items-center justify-between py-3 text-sm hover:bg-surface-muted/50 -mx-2 px-2 rounded-lg transition"
            >
              <div>
                <p className="font-medium text-ink">{o.reference}</p>
                <p className="text-xs text-ink-muted">{o.firstName} {o.lastName}</p>
              </div>
              <p className="font-medium text-ink">{Number(o.totalAmount).toLocaleString("fr-FR")} FCFA</p>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-center text-ink-muted py-6 text-sm">Aucune commande pour l'instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}
