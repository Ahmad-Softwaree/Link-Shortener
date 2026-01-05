"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============================================
// CREATE Operations
// ============================================

export async function createLink(data: {
  originalUrl: string;
  shortCode: string;
}) {
  // 1. Authenticate
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 2. Validate input
  if (!data.originalUrl || !data.shortCode) {
    throw new Error("Missing required fields");
  }

  // 3. Perform database operation
  try {
    const [newLink] = await db
      .insert(links)
      .values({
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        userId,
      })
      .returning();

    // 4. Revalidate cache
    revalidatePath("/dashboard");

    return { success: true, data: newLink };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, error: "Failed to create link" };
  }
}

// ============================================
// READ Operations
// ============================================

export async function getUserLinks() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt));

    return { success: true, data: userLinks };
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return { success: false, error: "Failed to fetch links", data: [] };
  }
}

export async function getLinkByShortCode(shortCode: string) {
  try {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode))
      .limit(1);

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to fetch link:", error);
    return { success: false, error: "Failed to fetch link" };
  }
}

export async function getLinkById(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [link] = await db
      .select()
      .from(links)
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .limit(1);

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to fetch link:", error);
    return { success: false, error: "Failed to fetch link" };
  }
}

// ============================================
// UPDATE Operations
// ============================================

export async function updateLink(
  id: number,
  data: { originalUrl?: string; shortCode?: string }
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [updatedLink] = await db
      .update(links)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning();

    if (!updatedLink) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

// ============================================
// DELETE Operations
// ============================================

export async function deleteLink(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [deletedLink] = await db
      .delete(links)
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning();

    if (!deletedLink) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}
