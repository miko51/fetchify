const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Désactiver la génération statique pour les pages utilisant des headers/cookies
  experimental: {
    dynamicIO: false,
  },
};

module.exports = withNextIntl(nextConfig);
