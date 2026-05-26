/**
 * SADDLES MARKET — SINGLE SOURCE OF TRUTH (Frontend)
 * All site-wide contact info, branding, and constants live here.
 * Update here once and it propagates across the entire frontend.
 */

export const SITE_CONFIG = {
  name: "Saddles Market",
  tagline: "Premium Horse Saddles for the Discerning Equestrian",
  description:
    "Saddles Market offers the finest selection of premium horse saddles, expertly crafted for Western, English, dressage, jumping, and trail riding disciplines. Free 30-day trial on all saddles.",
  url: "https://saddlesmarket.com",

  contact: {
    supportEmail: "support@saddlesmarket.com",
    salesEmail: "sales@saddlesmarket.com",
    phone: "+1 (914) 432-9936",
    phoneDisplay: "+1 (914) 432-9936",
    whatsapp: "+1 (669) 247-2718",
    whatsappDisplay: "+1 (669) 247-2718",
    whatsappLink: "https://wa.me/16692472718",
  },

  address: {
    street: "4001 Wing Commander Way",
    city: "Lexington",
    state: "KY",
    zip: "40511",
    country: "USA",
    countryFull: "United States",
    full: "4001 Wing Commander Way, Lexington, KY 40511, USA",
    mapsLink:
      "https://maps.google.com/?q=4001+Wing+Commander+Way+Lexington+KY+40511",
  },

  social: {
    facebook: "https://facebook.com/saddlesmarket",
    instagram: "https://instagram.com/saddlesmarket",
    twitter: "https://twitter.com/saddlesmarket",
    pinterest: "https://pinterest.com/saddlesmarket",
    youtube: "https://youtube.com/@saddlesmarket",
  },

  trial: {
    days: 30,
    description: "30-Day Free Trial — Try your saddle risk-free.",
  },

  currency: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
  },

  shipping: {
    freeShippingThreshold: 500,
    standardShippingCost: 49,
    expressShippingCost: 99,
    standardRate: 49,
    expressRate: 99,
    standardDays: "5-7",
    expressDays: "2-3",
    internationalDays: "10-21",
  },

  policies: {
    returnDays: 30,
    trialDays: 30,
  },

  seo: {
    defaultTitle: "Saddles Market — Premium Horse Saddles",
    titleTemplate: "%s | Saddles Market",
    defaultDescription:
      "Shop premium horse saddles at Saddles Market. Western, English, dressage, jumping & trail saddles. Expert quality, 30-day free trial, free shipping on orders over $500.",
    keywords: [
      "horse saddles",
      "buy horse saddles",
      "western saddles",
      "english saddles",
      "dressage saddles",
      "jumping saddles",
      "trail saddles",
      "horse saddles for sale",
      "premium horse saddles",
      "saddles market",
      "horse riding saddles",
      "custom horse saddles",
      "leather horse saddles",
    ],
    ogImage: "/og-image.jpg",
    twitterCard: "summary_large_image",
    twitterSite: "@saddlesmarket",
  },

  pwa: {
    name: "Saddles Market",
    shortName: "Saddles Market",
    themeColor: "#1C3557",
    backgroundColor: "#FAFAF7",
  },
  // Shorthand aliases (used across pages)
  phone: "+1 (914) 432-9936",
  whatsapp: "+1 (669) 247-2718",
  email: {
    support: "support@saddlesmarket.com",
    sales: "sales@saddlesmarket.com",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;

// Helper: Format price in USD
export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat(SITE_CONFIG.currency.locale, {
    style: "currency",
    currency: SITE_CONFIG.currency.code,
    minimumFractionDigits: 2,
  }).format(amount);

// Helper: Check if free shipping applies
export const isFreeShipping = (subtotal: number): boolean =>
  subtotal >= SITE_CONFIG.shipping.freeShippingThreshold;
