import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixFeatures() {
  console.log('🔧 Correction des features dans credit_packages...');

  const packages = await prisma.creditPackage.findMany();

  for (const pkg of packages) {
    let needsUpdate = false;
    let newFeatures = pkg.features;

    // Si features est null, vide, ou invalide, on met un tableau vide
    if (!pkg.features || pkg.features.trim() === '') {
      newFeatures = '[]';
      needsUpdate = true;
    } else {
      // Vérifier si le JSON est valide
      try {
        JSON.parse(pkg.features);
      } catch (error) {
        console.log(`⚠️  JSON invalide pour ${pkg.name}: ${pkg.features}`);
        newFeatures = '[]';
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await prisma.creditPackage.update({
        where: { id: pkg.id },
        data: { features: newFeatures },
      });
      console.log(`✅ Corrigé: ${pkg.name}`);
    } else {
      console.log(`✓ OK: ${pkg.name}`);
    }
  }

  console.log('✅ Terminé !');
}

fixFeatures()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

