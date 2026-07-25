import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Pas de redirect() ici : le middleware gère déjà la protection.
  // Si pas connecté, on affiche juste le contenu (la page de login) sans la sidebar.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <AdminSidebar userName={session.user?.name ?? "Admin"} />
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0">{children}</main>
    </div>
  );
}