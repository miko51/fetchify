import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY est manquant dans .env");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 999, // 9.99 EUR en centimes
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: 3999, // 39.99 EUR
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2000,
    price: 12999, // 129.99 EUR
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
  },
];
