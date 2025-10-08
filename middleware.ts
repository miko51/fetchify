import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Liste des langues supportées
  locales: ['fr', 'en', 'es', 'it', 'de'],
  
  // Langue par défaut
  defaultLocale: 'en',
  
  // Détection automatique de la langue
  localeDetection: true,
  
  // Préfixe de l'URL (toujours afficher la langue)
  localePrefix: 'always'
});

export const config = {
  // Matcher pour appliquer le middleware à toutes les routes sauf les API et fichiers statiques
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
