import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface Props {
  params: { slug: string };
}

// Server component: fetch product for metadata
async function getProduct(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      {
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description:
      product.short_description || product.description?.slice(0, 160),
    openGraph: {
      title: `${product.name} | ${SITE_CONFIG.name}`,
      description:
        product.short_description || product.description?.slice(0, 160),
      images: product.primary_image ? [{ url: product.primary_image }] : [],
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetailClient initialProduct={product} slug={params.slug} />;
}
