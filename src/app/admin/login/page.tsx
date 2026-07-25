import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Connexion Admin — Tech-Assist Dakar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
         <img src="/logo/logo-tech-assist.png" alt="Tech-Assist Dakar" className="h-20 object-contain" />
        </div>
        <h1 className="text-xl font-semibold text-ink text-center mb-6">
          Espace Administrateur
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
