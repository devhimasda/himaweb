"use server";

import { db } from "@/lib/db";
import { articles, categories } from "@/db/schema";
import { eq, desc, ilike, and, count, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createArticle(formData: FormData) {
  const session = await requireAuth();

  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = slugify(parsed.data.title);

  const existing = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  });

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const [article] = await db
    .insert(articles)
    .values({
      title: parsed.data.title,
      slug: finalSlug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || null,
      coverImage: parsed.data.coverImage || null,
      categoryId: parsed.data.categoryId || null,
      published: parsed.data.published,
      authorId: session.user.id,
    })
    .returning();

  revalidatePath("/news");
  revalidatePath("/admin/articles");
  revalidatePath("/");

  return { success: true, article };
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAuth();

  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [article] = await db
    .update(articles)
    .set({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || null,
      coverImage: parsed.data.coverImage || null,
      categoryId: parsed.data.categoryId || null,
      published: parsed.data.published,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning();

  revalidatePath("/news");
  revalidatePath(`/news/${article.slug}`);
  revalidatePath("/admin/articles");
  revalidatePath("/");

  return { success: true, article };
}

export async function deleteArticle(id: string) {
  await requireAuth();

  await db.delete(articles).where(eq(articles.id, id));

  revalidatePath("/news");
  revalidatePath("/admin/articles");
  revalidatePath("/");

  return { success: true };
}

export async function togglePublish(id: string) {
  await requireAuth();

  const article = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (!article) return { error: "Article not found" };

  await db
    .update(articles)
    .set({ published: !article.published, updatedAt: new Date() })
    .where(eq(articles.id, id));

  revalidatePath("/news");
  revalidatePath("/admin/articles");
  revalidatePath("/");

  return { success: true, published: !article.published };
}

export async function getPublishedArticles(
  page: number = 1,
  pageSize: number = 9,
  categorySlug?: string,
  search?: string
) {
  const conditions = [eq(articles.published, true)];

  if (search) {
    conditions.push(ilike(articles.title, `%${search}%`));
  }

  let categoryFilter;
  if (categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (cat) {
      conditions.push(eq(articles.categoryId, cat.id));
      categoryFilter = cat;
    }
  }

  const whereClause = and(...conditions);

  const [totalResult] = await db
    .select({ count: count() })
    .from(articles)
    .where(whereClause);

  const totalCount = totalResult.count;
  const totalPages = Math.ceil(totalCount / pageSize);
  const offset = (page - 1) * pageSize;

  const results = await db.query.articles.findMany({
    where: whereClause,
    with: { author: true, category: true },
    orderBy: [desc(articles.createdAt)],
    limit: pageSize,
    offset,
  });

  return {
    articles: results,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getArticleBySlug(slug: string) {
  const article = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.published, true)),
    with: { author: true, category: true },
  });

  if (article) {
    await db
      .update(articles)
      .set({ views: sql`${articles.views} + 1` })
      .where(eq(articles.id, article.id));
  }

  return article;
}

export async function getAllArticlesAdmin() {
  return db.query.articles.findMany({
    with: { author: true, category: true },
    orderBy: [desc(articles.createdAt)],
  });
}

export async function getArticleById(id: string) {
  return db.query.articles.findFirst({
    where: eq(articles.id, id),
    with: { author: true, category: true },
  });
}

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  });
}

export async function getAdminStats() {
  const [total] = await db.select({ count: count() }).from(articles);
  const [published] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.published, true));
  const [drafts] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.published, false));
  const [views] = await db
    .select({ total: sql<number>`COALESCE(SUM(${articles.views}), 0)` })
    .from(articles);

  return {
    totalArticles: total.count,
    publishedArticles: published.count,
    draftArticles: drafts.count,
    totalViews: Number(views.total),
  };
}
