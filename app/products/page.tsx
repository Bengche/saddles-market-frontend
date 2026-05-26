import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Horse Saddles — Shop All",
  description: `Browse our complete collection of premium horse saddles. Western, English, Dressage, Jumping, Trail, and more. Free shipping on orders over $${require("@/lib/siteConfig").SITE_CONFIG.shipping.freeShippingThreshold}. 30-day free trial.`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
