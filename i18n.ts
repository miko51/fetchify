import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Assurez-vous que locale est défini (par défaut 'en' si undefined)
  const safeLocale = locale || 'en';
  
  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default
  };
});
