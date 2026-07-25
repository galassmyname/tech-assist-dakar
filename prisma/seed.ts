import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Demarrage du seed...");

  const hashedPassword = await bcrypt.hash("Admin@2026", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@techassistdakar.com" },
    update: {},
    create: {
      email: "admin@techassistdakar.com",
      password: hashedPassword,
      name: "Administrateur Tech-Assist",
      role: "ADMIN",
    },
  });

  const categoriesData = [
    { name: "Ordinateurs", slug: "ordinateurs" },
    { name: "Smartphones", slug: "smartphones" },
    { name: "Accessoires informatiques", slug: "accessoires-informatiques" },
    { name: "Composants", slug: "composants" },
    { name: "Peripheriques", slug: "peripheriques" },
    { name: "Stockage (Disques durs & SSD)", slug: "stockage" },
    { name: "Montres connectees", slug: "montres-connectees" },
    { name: "Ecouteurs & Audio", slug: "ecouteurs-audio" },
    { name: "Electronique grand public", slug: "electronique-grand-public" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }

  const productsData = [
    {
      name: "Laptop HP EliteBook 840 G8 - i5 16Go RAM",
      slug: "laptop-hp-elitebook-840-g8",
      description:
        "Ordinateur portable professionnel, Intel Core i5 11e generation, 16 Go de RAM, SSD 512 Go, ecran 14 pouces Full HD. Ideal pour le bureau et les etudes.",
      price: 425000,
      stock: 8,
      brand: "HP",
      categorySlug: "ordinateurs",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/hp-elitebook.jpg"],
    },
    {
      name: "PC Portable Dell Inspiron 15 - i7 8Go RAM",
      slug: "pc-dell-inspiron-15",
      description:
        "Dell Inspiron 15, Intel Core i7, 8 Go RAM, SSD 256 Go, carte graphique dediee. Parfait pour la bureautique et le multimedia.",
      price: 395000,
      stock: 5,
      brand: "Dell",
      categorySlug: "ordinateurs",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/dell-inspiron.jpg"],
    },
    {
      name: "Samsung Galaxy A55 5G - 128 Go",
      slug: "samsung-galaxy-a55",
      description:
        "Smartphone Samsung Galaxy A55, ecran AMOLED 6.6 pouces, 128 Go de stockage, appareil photo 50MP, batterie longue duree.",
      price: 235000,
      stock: 15,
      brand: "Samsung",
      categorySlug: "smartphones",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/galaxy-a55.jpg"],
    },
    {
      name: "iPhone 13 - 128 Go (Reconditionne)",
      slug: "iphone-13-128go",
      description:
        "iPhone 13 reconditionne grade A, 128 Go, ecran Super Retina XDR, garantie 6 mois.",
      price: 385000,
      stock: 4,
      brand: "Apple",
      categorySlug: "smartphones",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/iphone-13.jpg"],
    },
    {
      name: "Clavier mecanique RGB filaire",
      slug: "clavier-mecanique-rgb",
      description:
        "Clavier gaming mecanique avec retroeclairage RGB personnalisable, switches bleus, resistant et confortable.",
      price: 22000,
      stock: 25,
      brand: "Generic",
      categorySlug: "accessoires-informatiques",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/clavier-rgb.jpg"],
    },
    {
      name: "Souris sans fil ergonomique",
      slug: "souris-sans-fil-ergonomique",
      description:
        "Souris optique sans fil, ergonomique, jusqu'a 6 mois d'autonomie, compatible Windows et Mac.",
      price: 9500,
      stock: 40,
      brand: "Logitech",
      categorySlug: "accessoires-informatiques",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/souris-sans-fil.jpg"],
    },
    {
      name: "SSD NVMe 512 Go",
      slug: "ssd-nvme-512go",
      description:
        "Disque SSD NVMe M.2 512 Go, vitesse de lecture jusqu'a 3500 Mo/s, compatible avec la plupart des laptops et PC de bureau.",
      price: 38000,
      stock: 18,
      brand: "Kingston",
      categorySlug: "composants",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/ssd-nvme.jpg"],
    },
    {
      name: "Barrette RAM DDR4 16 Go 3200MHz",
      slug: "ram-ddr4-16go",
      description:
        "Memoire RAM DDR4 16 Go, frequence 3200MHz, compatible desktop et laptop selon modele.",
      price: 27000,
      stock: 20,
      brand: "Kingston",
      categorySlug: "composants",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/ram-ddr4.jpg"],
    },
    {
      name: "Ecran LED 24 pouces Full HD",
      slug: "ecran-led-24-pouces",
      description:
        "Moniteur LED 24 pouces, resolution Full HD 1920x1080, ports HDMI et VGA, ideal bureautique et gaming leger.",
      price: 85000,
      stock: 10,
      brand: "Samsung",
      categorySlug: "peripheriques",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/ecran-led.jpg"],
    },
    {
      name: "Imprimante multifonction HP DeskJet",
      slug: "imprimante-hp-deskjet",
      description:
        "Imprimante, scanner, photocopieuse. Ideale pour un usage domestique ou petit bureau. Connexion USB et Wi-Fi.",
      price: 65000,
      stock: 7,
      brand: "HP",
      categorySlug: "peripheriques",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/imprimante-hp.jpg"],
    },
    {
      name: "Disque dur externe 1To USB 3.0",
      slug: "disque-dur-externe-1to",
      description:
        "Disque dur externe portable 1 To, connexion USB 3.0, compatible PC et Mac, ideal pour sauvegardes et transfert de fichiers.",
      price: 45000,
      stock: 20,
      brand: "Seagate",
      categorySlug: "stockage",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/disque-dur-1to.jpg"],
    },
    {
      name: "Montre connectee Smartwatch Sport",
      slug: "montre-connectee-sport",
      description:
        "Montre intelligente avec suivi cardiaque, notifications, GPS et autonomie longue duree. Compatible Android et iOS.",
      price: 32000,
      stock: 15,
      brand: "Generic",
      categorySlug: "montres-connectees",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/smartwatch.jpg"],
    },
    {
      name: "Ecouteurs sans fil type AirPods",
      slug: "ecouteurs-sans-fil",
      description:
        "Ecouteurs Bluetooth sans fil avec boitier de charge, reduction de bruit, autonomie jusqu'a 24h avec le boitier.",
      price: 18000,
      stock: 30,
      brand: "Generic",
      categorySlug: "ecouteurs-audio",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/airpods.jpg"],
    },
    {
      name: "Enceinte Bluetooth portable",
      slug: "enceinte-bluetooth-portable",
      description:
        "Enceinte portable Bluetooth, son puissant, resistante aux eclaboussures, autonomie 10h.",
      price: 25000,
      stock: 12,
      brand: "JBL",
      categorySlug: "electronique-grand-public",
      images: ["https://res.cloudinary.com/demo/image/upload/v1/tech-assist/enceinte-bluetooth.jpg"],
    },
  ];

  for (const p of productsData) {
    const { images, categorySlug, ...productFields } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productFields,
        categoryId: categories[categorySlug],
        images: {
          create: images.map((url, i) => ({
            url,
            publicId: `seed-${p.slug}-${i}`,
            position: i,
          })),
        },
      },
    });
  }

  console.log("Seed termine avec succes.");
  console.log("Admin: admin@techassistdakar.com / Admin@2026");
}

main()
  .catch((e) => {
    console.error("Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
