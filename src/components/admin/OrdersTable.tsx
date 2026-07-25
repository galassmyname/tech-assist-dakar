"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { updateOrderStatus } from "@/actions/order-actions";

type Order = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  city: string;
  totalAmount: number;
  status: "EN_ATTENTE" | "CONFIRMEE" | "LIVREE" | "ANNULEE";
  itemCount: number;
  createdAt: string;
};

const statusLabels: Record<Order["status"], string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmee",
  LIVREE: "Livree",
  ANNULEE: "Annulee",
};

const statusColors: Record<Order["status"], string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  CONFIRMEE: "bg-blue-100 text-blue-700",
  LIVREE: "bg-green-100 text-green-700",
  ANNULEE: "bg-red-100 text-red-700",
};

const filters: { label: string; value?: string }[] = [
  { label: "Toutes", value: undefined },
  { label: "En attente", value: "EN_ATTENTE" },
  { label: "Confirmees", value: "CONFIRMEE" },
  { label: "Livrees", value: "LIVREE" },
  { label: "Annulees", value: "ANNULEE" },
];

export default function OrdersTable({
  orders: initialOrders,
  activeStatus,
}: {
  orders: Order[];
  activeStatus?: string;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, newStatus: Order["status"]) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    startTransition(async () => {
      await updateOrderStatus(id, newStatus);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() =>
              router.push(f.value ? `/admin/commandes?status=${f.value}` : "/admin/commandes")
            }
            className={`text-sm px-3.5 py-1.5 rounded-full border transition ${
              activeStatus === f.value
                ? "bg-primary text-white border-primary"
                : "border-gray-200 text-ink-muted hover:border-primary hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-ink-muted text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Reference</th>
              <th className="text-left px-4 py-3 font-medium">Client</th>
              <th className="text-left px-4 py-3 font-medium">Ville</th>
              <th className="text-left px-4 py-3 font-medium">Articles</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Statut</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-right px-4 py-3 font-medium">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-muted/50">
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{o.reference}</td>
                <td className="px-4 py-3">
                  <p className="text-ink">{o.customerName}</p>
                  <p className="text-xs text-ink-muted">{o.phone}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{o.city}</td>
                <td className="px-4 py-3 text-ink-muted">{o.itemCount}</td>
                <td className="px-4 py-3 text-ink font-medium whitespace-nowrap">
                  {o.totalAmount.toLocaleString("fr-FR")} FCFA
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                    disabled={isPending}
                    className={`text-xs font-medium rounded-full px-2.5 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${statusColors[o.status]}`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-ink-muted whitespace-nowrap text-xs">
                  {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/commandes/${o.id}`}
                    className="inline-flex p-2 text-ink-muted hover:text-primary hover:bg-surface-muted rounded-lg transition"
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ink-muted">
                  Aucune commande pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
