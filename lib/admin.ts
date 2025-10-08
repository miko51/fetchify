import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * Vérifie si l'utilisateur connecté est un administrateur
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  } catch (error) {
    console.error("Erreur lors de la vérification admin:", error);
    return false;
  }
}

/**
 * Retourne l'utilisateur admin connecté ou null
 */
export async function getAdminUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur admin:", error);
    return null;
  }
}
