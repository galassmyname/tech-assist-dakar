"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/order-actions";

type Status = "EN_ATTENTE" | "CONFIRMEE" | "LIVREE" | "ANNULEE";

const statusLabels: Record<Status, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmee",
  LIVREE: "Livree",
  ANNULEE: "Annulee",
};

const statusColors: Record<Status, string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  CONFIRMEE: "bg-blue-100 text-blue-700",
  LIVREE: "bg-green-100 text-green-700",
  ANNULEE: "bg-red-100 text-red-700",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: Status;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: Status) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={isPending}
      className={`text-sm font-medium rounded-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${statusColors[status]}`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}
