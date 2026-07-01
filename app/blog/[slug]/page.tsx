import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, User, Calendar, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/types";

interface Props {
  params: { slug: string };
}

async function getPost(
  slug: string,
): Promise<{ post: BlogPost; related: BlogPost[] } | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPost(params.slug);
  if (!data) return { title: "Article Not Found" };
  const { post } = data;

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const data = await getPost(params.slug);
  if (!data) notFound();
  const { post, related } = data;

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Hero image */}
      {post.cover_image && (
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden bg-primary-900">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/70" />
        </div>
      )}

      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 py-6">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-primary-600">
              Blog
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 truncate max-w-xs">
              {post.title}
            </span>
          </nav>

          <article className="bg-white rounded-2xl shadow-card p-8 md:p-12 mb-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge bg-primary-50 text-primary-600 text-sm">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} /> {post.reading_time} min read
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={14} /> {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <User size={14} /> {post.author_name}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-gold-400 pl-5 italic">
              {post.excerpt}
            </p>

            <div
              className="prose-luxury"
              dangerouslySetInnerHTML={{
                __html: post.body
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n/g, "<br/>"),
              }}
            />

            {/* Share & back */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft size={16} /> All Articles
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Share:</span>
                {[
                  {
                    label: "Twitter",
                    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_CONFIG.url}/blog/${post.slug}`)}`,
                  },
                  {
                    label: "Facebook",
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_CONFIG.url}/blog/${post.slug}`)}`,
                  },
                ].map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors underline underline-offset-2"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </article>

          {/* Related posts */}
          {related?.length > 0 && (
            <div className="mb-16">
              <h2 className="font-serif text-2xl font-bold text-primary-500 mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[16/9] bg-cream-200 overflow-hidden">
                      {p.cover_image && (
                        <Image
                          src={p.cover_image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="33vw"
                        />
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <span className="badge bg-primary-50 text-primary-600 text-xs mb-2">
                        {p.category}
                      </span>
                      <p className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm line-clamp-2">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-primary-500 rounded-2xl p-8 text-center mb-16">
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              Ready to Find Your Perfect Saddle?
            </h3>
            <p className="text-white/70 mb-6 text-sm">
              Browse our curated collection with free 30-day trial on every
              saddle.
            </p>
            <Link href="/products" className="btn-gold px-8 py-3">
              Shop Saddles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
