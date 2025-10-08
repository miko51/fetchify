import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Créer les packs de crédits par défaut
  const packages = [
    {
      id: "starter",
      name: "Starter",
      credits: 100,
      price: 999, // 9.99 EUR
      isActive: true,
    },
    {
      id: "pro",
      name: "Pro",
      credits: 500,
      price: 3999, // 39.99 EUR
      isActive: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      credits: 2000,
      price: 12999, // 129.99 EUR
      isActive: true,
    },
  ];

  for (const pkg of packages) {
    const existing = await prisma.creditPackage.findFirst({
      where: { id: pkg.id },
    });

    if (!existing) {
      await prisma.creditPackage.create({
        data: pkg,
      });
      console.log(`✅ Package créé : ${pkg.name} (${pkg.credits} crédits - ${pkg.price / 100}€)`);
    } else {
      console.log(`⏭️  Package existant : ${pkg.name}`);
    }
  }

  console.log("✨ Seeding terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

