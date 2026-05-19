"use server";

import { put, del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function uploadImage(formData: FormData) {
  try {
    await requireAuth();
  } catch {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const maxSize = 4.5 * 1024 * 1024; // 4.5MB max for Vercel Blob
  if (file.size > maxSize) {
    return { error: "File size must be less than 4.5MB" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }

  const blob = await put(`hima/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return { success: true, url: blob.url };
}

export async function deleteImage(url: string) {
  try {
    await requireAuth();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    await del(url);
    return { success: true };
  } catch {
    return { error: "Failed to delete image" };
  }
}
