"use server";

import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createCategory(formData: FormData) {
  try {
    await requireAuth();

    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const baseSlug = slugify(parsed.data.name);

    // Ensure unique slug
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, baseSlug),
    });

    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    await db.insert(categories).values({
      name: parsed.data.name,
      description: parsed.data.description || null,
      slug,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles"); // Editor fetches categories
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Create Category Error:", error);
    const message = error instanceof Error ? error.message : "Failed to create category";
    return { error: message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await requireAuth();

    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const updateData: { name: string; description: string | null } = {
      name: parsed.data.name,
      description: parsed.data.description || null,
    };

    // If name changes, we update the slug. But normally categories might want to keep slugs.
    // For simplicity, we just update the name and description. We'll leave the slug untouched 
    // unless you want dynamic slug updating which can break existing links.
    
    await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Update Category Error:", error);
    const message = error instanceof Error ? error.message : "Failed to update category";
    return { error: message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAuth();

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete Category Error:", error);
    return { error: "Failed to delete category" };
  }
}

export async function getCategoryById(id: string) {
  return db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
}
