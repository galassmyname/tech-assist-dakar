import { getAdminOrders } from "@/actions/order-actions";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await getAdminOrders(status);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Commandes</h1>
      <OrdersTable
        orders={orders.map((o) => ({
          id: o.id,
          reference: o.reference,
          customerName: `${o.firstName} ${o.lastName}`,
          phone: o.phone,
          city: o.city,
          totalAmount: Number(o.totalAmount),
          status: o.status,
          itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
          createdAt: o.createdAt.toISOString(),
        }))}
        activeStatus={status}
      />
    </div>
  );
}
