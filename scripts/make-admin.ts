import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = "mickael.ohayon@gmail.com";

  try {
    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Utilisateur ${email} non trouvé`);
      process.exit(1);
    }

    // Mettre à jour isAdmin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log(`✅ Utilisateur ${updatedUser.email} est maintenant administrateur !`);
    console.log(`   - ID: ${updatedUser.id}`);
    console.log(`   - Nom: ${updatedUser.name}`);
    console.log(`   - Admin: ${updatedUser.isAdmin}`);
    console.log(`   - Crédits: ${updatedUser.credits}`);
    console.log(`\n🎉 Vous pouvez maintenant accéder à l'admin sur http://localhost:3005/admin`);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();

