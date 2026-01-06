"use server";

import { db } from "@/lib/db";
import { links, type Link, type NewLink } from "@/lib/db/schema";
import { eq, ilike, or, and, desc, sql } from "drizzle-orm";
import type { QueryParam } from "@/types/global";

export type CRUDReturn = { message: string; data?: any };

export type PaginationResult<T> = {
  data: T[];
  total: number;
  hasMore: boolean;
};

export const getLinks = async (
  userId: string,
  queries?: QueryParam
): Promise<PaginationResult<Link>> => {
  const page = Number(queries?.page) || 0;
  const limit = Number(queries?.limit) || 100;
  const search = (queries?.search as string) || "";

  const offset = page * limit;

  const whereConditions: any[] = [eq(links.userId, userId)];

  if (search) {
    whereConditions.push(
      or(
        ilike(links.shortCode, `%${search}%`),
        ilike(links.originalUrl, `%${search}%`)
      )!
    );
  }

  console.log("getLinks", { userId, page, limit, search });

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(links)
        .where(
          whereConditions.length === 1
            ? whereConditions[0]
            : and(...whereConditions)
        )
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(links)
        .where(
          whereConditions.length === 1
            ? whereConditions[0]
            : and(...whereConditions)
        ),
    ]);

    console.log("getLinks result", {
      dataLength: data.length,
      total: totalResult[0]?.count,
    });

    const total = totalResult[0]?.count || 0;

    return {
      data,
      total,
      hasMore: offset + data.length < total,
    };
  } catch (error) {
    console.error("getLinks error:", error);
    throw error;
  }
};

export const getLink = async (
  id: number,
  userId: string
): Promise<Link | null> => {
  const result = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .limit(1);

  return result[0] || null;
};

export const addLink = async (
  form: Omit<NewLink, "userId">,
  userId: string
): Promise<CRUDReturn> => {
  const existing = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, form.shortCode))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Short code already exists");
  }

  const [newLink] = await db
    .insert(links)
    .values({
      ...form,
      userId,
    })
    .returning();

  return {
    message: "Link created successfully",
    data: newLink,
  };
};

export const updateLink = async (
  id: number,
  form: Partial<Omit<NewLink, "userId">>,
  userId: string
): Promise<CRUDReturn> => {
  if (form.shortCode) {
    const existing = await db
      .select()
      .from(links)
      .where(and(eq(links.shortCode, form.shortCode), eq(links.userId, userId)))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
      throw new Error("Short code already exists");
    }
  }

  const [updatedLink] = await db
    .update(links)
    .set({
      ...form,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();

  if (!updatedLink) {
    throw new Error("Link not found");
  }

  return {
    message: "Link updated successfully",
    data: updatedLink,
  };
};

export const deleteLink = async (
  id: number,
  userId: string
): Promise<CRUDReturn> => {
  const [deletedLink] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();

  if (!deletedLink) {
    throw new Error("Link not found");
  }

  return {
    message: "Link deleted successfully",
    data: deletedLink,
  };
};

export const getLinkByShortCode = async (
  shortCode: string
): Promise<{ success: boolean; data?: Link }> => {
  try {
    const result = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode))
      .limit(1);

    if (!result || result.length === 0) {
      return { success: false };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("getLinkByShortCode error:", error);
    return { success: false };
  }
};
