# Tech-Assist Dakar — Boutique e-commerce

Site e-commerce full-stack pour Tech-Assist Dakar, revendeur d'électronique
(ordinateurs, smartphones, disques durs, montres connectées, écouteurs,
accessoires, composants, périphériques) basé à Dakar, Sénégal.

## Stack technique

- **Frontend** : Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend** : Server Actions Next.js
- **Base de données** : PostgreSQL + Prisma ORM
- **Stockage images** : Cloudinary
- **Panier** : Zustand (persistant en localStorage)
- **Authentification admin** : NextAuth (Credentials)

## Installation locale

### 1. Prérequis
- Node.js 18+
- Une base PostgreSQL (locale, ou hébergée via Neon / Supabase / Railway)
- Un compte Cloudinary gratuit (https://cloudinary.com)

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copiez `.env.example` en `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

- `DATABASE_URL` : chaîne de connexion PostgreSQL
- `AUTH_SECRET` : générez avec `npx auth secret`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` : depuis votre dashboard Cloudinary
- `NEXT_PUBLIC_SITE_URL` : URL du site (http://localhost:3000 en local)

### 4. Créer la base de données et charger les données de test

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Cela crée :
- Les tables (Category, Product, ProductImage, Order, OrderItem, AdminUser)
- 9 catégories (Ordinateurs, Smartphones, Accessoires informatiques, Composants,
  Périphériques, Stockage, Montres connectées, Écouteurs & Audio, Électronique
  grand public)
- 14 produits de démonstration
- Un compte admin :
  - **Email** : `admin@techassistdakar.com`
  - **Mot de passe** : `Admin@2026`
  - ⚠️ À changer immédiatement après le premier déploiement.

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Le site est accessible sur http://localhost:3000
L'espace admin est accessible sur http://localhost:3000/admin

## Structure du projet

```
src/
├── app/
│   ├── (shop)/          → boutique publique (accueil, produits, panier, commande)
│   ├── admin/            → espace administrateur (protégé)
│   └── api/auth/          → route NextAuth
├── components/
│   ├── shop/              → composants boutique
│   └── admin/              → composants admin
├── actions/               → Server Actions (produits, catégories, commandes, upload)
├── lib/                   → prisma, cloudinary, auth
└── store/                 → panier (Zustand)
prisma/
├── schema.prisma          → modèle de données
└── seed.ts                → données de démonstration
public/logo/                → logo Tech-Assist Dakar
```

## Fonctionnalités

### Boutique publique
- Accueil avec catégories et produits récents
- Catalogue avec recherche texte + filtres par catégorie + pagination
- Fiche produit détaillée (galerie d'images, description, JSON-LD SEO)
- Panier persistant (localStorage)
- Tunnel de commande (prénom, nom, téléphone, adresse, ville)
- Page de confirmation de commande

### Espace admin (`/admin`)
- Authentification par email/mot de passe
- Dashboard avec statistiques et dernières commandes
- CRUD catégories
- CRUD produits avec upload d'images Cloudinary (plusieurs images par produit)
- Gestion des commandes : filtrage par statut, changement de statut
  (En attente / Confirmée / Livrée / Annulée)

### SEO
- `sitemap.xml` et `robots.txt` générés dynamiquement
- Metadata par page (title, description, Open Graph)
- JSON-LD schema.org (Product + Organization)

## Déploiement en production

1. Créer une base PostgreSQL en production (Neon, Supabase, Railway...)
2. Déployer sur Vercel (recommandé pour Next.js) : connecter le repo GitHub
3. Renseigner les variables d'environnement sur Vercel
4. Lancer la migration en production :
   ```bash
   npx prisma migrate deploy
   ```
5. Changer le mot de passe admin par défaut
6. Soumettre `https://votredomaine.com/sitemap.xml` à Google Search Console

## Sécurité

- Les prix et le stock sont revérifiés côté serveur (base de données) au moment
  de la création de la commande — jamais fait confiance aux valeurs envoyées par
  le panier client.
- La création de commande se fait dans une transaction Prisma : vérification du
  stock, décrément atomique, aucun risque de survente.
- Toutes les routes `/admin/*` sont protégées par middleware NextAuth.
- L'upload d'images vers Cloudinary utilise une signature générée côté serveur
  (jamais de clé secrète exposée au client).

## Notes

- Devise : FCFA (affichage uniquement, pas de conversion multi-devises)
- Format téléphone validé : format sénégalais (7X XXX XX XX)
- Paiement : à la livraison (pas d'intégration de paiement en ligne pour l'instant)
