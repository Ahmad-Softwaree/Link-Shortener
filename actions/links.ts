"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and, desc, lt, or, ilike } from "drizzle-orm";
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
    return { success: false, error: "Failed to fetch links", data: [] };
  }
}

/**
 * Get user links with pagination support
 * @param cursor - The ID of the last item from the previous page (for infinite scroll)
 * @param limit - Number of items per page (default: 10)
 * @param search - Search query to filter links by URL or short code
 */
export async function getUserLinksPaginated(params: {
  cursor?: number;
  limit?: number;
  search?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const limit = params.limit || 10;

  try {
    // Build base conditions
    let conditions = eq(links.userId, userId);

    // Add search condition if search query is provided
    if (params.search && params.search.trim()) {
      const searchCondition = or(
        ilike(links.originalUrl, `%${params.search}%`),
        ilike(links.shortCode, `%${params.search}%`)
      );
      conditions = and(conditions, searchCondition) as any;
    }

    // Add cursor condition for pagination
    if (params.cursor) {
      conditions = and(conditions, lt(links.id, params.cursor)) as any;
    }

    const userLinks = await db
      .select()
      .from(links)
      .where(conditions)
      .orderBy(desc(links.createdAt))
      .limit(limit + 1); // Fetch one extra to check if there's a next page

    // Check if there's a next page
    const hasNextPage = userLinks.length > limit;
    const items = hasNextPage ? userLinks.slice(0, limit) : userLinks;
    const nextCursor = hasNextPage ? items[items.length - 1].id : undefined;

    return {
      success: true,
      data: {
        items,
        nextCursor,
        hasNextPage,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch links",
      data: { items: [], nextCursor: undefined, hasNextPage: false },
    };
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
    return { success: false, error: "Failed to delete link" };
  }
}
