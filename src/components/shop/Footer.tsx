export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="inline-block bg-white rounded-xl px-3 py-2 mb-3">
            <img src="/logo/logo-tech-assist.png" alt="Tech-Assist Dakar" className="h-12 object-contain" />
          </div>
          <p className="text-sm text-gray-400">
            Votre boutique d'électronique à Dakar : informatique, téléphonie, audio, accessoires connectés et bien plus.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-3 text-sm">Contact</h3>
          <p className="text-sm text-gray-400">Dakar, Sénégal</p>
          <p className="text-sm text-gray-400">contact@techassistdakar.com</p>
        </div>
        <div>
          <h3 className="font-medium mb-3 text-sm">Liens rapides</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <a href="/produits">Tous les produits</a>
            <a href="/panier">Mon panier</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Tech-Assist Dakar — Tous droits réservés
      </div>
    </footer>
  );
}