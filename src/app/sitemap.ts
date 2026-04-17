import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { posts } from "@/lib/data/posts";
import { products } from "@/lib/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  const staticPaths = [
    "/",
    "/about",
    "/cognitive-reserve",
    "/programs",
    "/shop",
    "/training",
    "/training/reaction",
    "/training/sequence",
    "/training/stroop",
    "/screening",
    "/screening/self-check",
    "/screening/lifestyle",
    "/blog",
    "/contact",
    "/legal/terms",
    "/legal/privacy",
    "/legal/disclaimer",
    "/legal/refund",
    "/legal/shipping",
    "/legal/cookies"
  ];

  const now = new Date().toISOString();

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: now
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date
    })),
    ...products.map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: now
    }))
  ];
}
