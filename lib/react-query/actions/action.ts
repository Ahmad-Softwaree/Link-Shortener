import { db } from "@/lib/db";
import { eq, ilike, or, and, desc, sql } from "drizzle-orm";
import type { QueryParam } from "@/types/global";
import type { PgTable } from "drizzle-orm/pg-core";

export type CRUDReturn = { message: string; data?: any };

export type PaginationResult<T> = {
  data: T[];
  total: number;
  hasMore: boolean;
};

export const getData = async <T>(
  table: PgTable,
  userId: string,
  queries?: QueryParam
): Promise<PaginationResult<T>> => {
  const page = Number(queries?.page) || 0;
  const limit = Number(queries?.limit) || 10;
  const search = (queries?.search as string) || "";
  const status = queries?.status as string;

  const offset = page * limit;

  const userIdColumn = (table as any).userId;
  let whereConditions = [eq(userIdColumn, userId)];

  if (search) {
    const searchableColumns = Object.values(table).filter(
      (col: any) => col.dataType === "string"
    );
    if (searchableColumns.length > 0) {
      whereConditions.push(
        or(
          ...searchableColumns.map((col: any) => ilike(col, `%${search}%`))
        ) as any
      );
    }
  }

  if (status) {
    const statusColumn = (table as any).status;
    if (statusColumn) {
      whereConditions.push(eq(statusColumn, status));
    }
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(table)
      .where(and(...whereConditions))
      .orderBy(desc((table as any).createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(table)
      .where(and(...whereConditions)),
  ]);

  const total = totalResult[0]?.count || 0;

  return {
    data: data as T[],
    total,
    hasMore: offset + data.length < total,
  };
};

export const getOneData = async <T>(
  table: PgTable,
  id: number,
  userId: string
): Promise<T | null> => {
  const idColumn = (table as any).id;
  const userIdColumn = (table as any).userId;

  const result = await db
    .select()
    .from(table)
    .where(and(eq(idColumn, id), eq(userIdColumn, userId)))
    .limit(1);

  return (result[0] as T) || null;
};

export const addData = async <T>(
  table: PgTable,
  form: Record<string, any>,
  userId: string,
  uniqueField?: string
): Promise<CRUDReturn> => {
  if (uniqueField && form[uniqueField]) {
    const uniqueColumn = (table as any)[uniqueField];
    const existing = await db
      .select()
      .from(table)
      .where(eq(uniqueColumn, form[uniqueField]))
      .limit(1);

    if (existing.length > 0) {
      throw new Error(`${uniqueField} already exists`);
    }
  }

  const [newData] = await db
    .insert(table)
    .values({
      ...form,
      userId,
    })
    .returning();

  return {
    message: "Data created successfully",
    data: newData,
  };
};

export const updateData = async <T>(
  table: PgTable,
  id: number,
  form: Record<string, any>,
  userId: string,
  uniqueField?: string
): Promise<CRUDReturn> => {
  const idColumn = (table as any).id;
  const userIdColumn = (table as any).userId;

  if (uniqueField && form[uniqueField]) {
    const uniqueColumn = (table as any)[uniqueField];
    const existing = await db
      .select()
      .from(table)
      .where(and(eq(uniqueColumn, form[uniqueField]), eq(userIdColumn, userId)))
      .limit(1);

    if (existing.length > 0 && (existing[0] as any).id !== id) {
      throw new Error(`${uniqueField} already exists`);
    }
  }

  const [updatedData] = await db
    .update(table)
    .set({
      ...form,
      updatedAt: new Date(),
    })
    .where(and(eq(idColumn, id), eq(userIdColumn, userId)))
    .returning();

  if (!updatedData) {
    throw new Error("Data not found");
  }

  return {
    message: "Data updated successfully",
    data: updatedData,
  };
};

export const deleteData = async (
  table: PgTable,
  id: number,
  userId: string
): Promise<CRUDReturn> => {
  const idColumn = (table as any).id;
  const userIdColumn = (table as any).userId;

  const [deletedData] = await db
    .delete(table)
    .where(and(eq(idColumn, id), eq(userIdColumn, userId)))
    .returning();

  if (!deletedData) {
    throw new Error("Data not found");
  }

  return {
    message: "Data deleted successfully",
    data: deletedData,
  };
};
