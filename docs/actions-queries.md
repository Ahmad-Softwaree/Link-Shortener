# Actions & Queries Architecture

> **⚠️ CRITICAL: Generic First, Specific Only When Needed**  
> Use generic CRUD functions for all standard operations. Only create table-specific files when custom logic is required.

## 📋 Overview

This project uses a **generic actions and queries pattern** to minimize code duplication and maintain consistency across all data operations.

- **Actions** (`/actions`) - Server-side data fetching and mutations
- **Queries** (`/queries`) - TanStack Query hooks that wrap actions with caching, optimistic updates, and error handling

## 🗂️ File Structure

```
actions/
  actions.ts          # Generic CRUD functions (USE THIS FIRST)
  [table-name].ts     # Only create if custom logic needed

queries/
  queries.ts          # Generic TanStack Query hooks (USE THIS FIRST)
  [table-name].ts     # Only create if custom logic needed
```

### When to Create Table-Specific Files

**❌ DON'T create specific files for:**

- Standard CRUD operations
- Simple filtering/searching
- Pagination
- Soft delete/restore

**✅ DO create specific files when:**

- Complex business logic required
- Multiple related operations in a transaction
- Custom validation or transformation
- Specialized endpoints

## 🔧 Generic Actions (`actions/actions.ts`)

### Core Functions

All generic actions must support these operations:

```typescript
// 1. Get paginated or full data
getData<T>(name: string, queries?: QueryParam, id?: number): Promise<PaginationType<T> | T>

// 2. Get selection data (for dropdowns, etc.)
getDataSelection<T>(name: string, queries?: QueryParam): Promise<T[]>

// 3. Get single record
getOneData<T>(name: string, id: number, queries?: QueryParam): Promise<T>

// 4. Add new record
addData<T>(name: string, form: T, queries?: QueryParam): Promise<CRUDReturn>

// 5. Update existing record
updateData<T>(name: string, form: T, id: number, queries?: QueryParam): Promise<CRUDReturn>

// 6. Change state (soft delete/restore OR hard delete)
changeStateData(name: string, id: number, queries?: QueryParam): Promise<CRUDReturn>
```

### Implementation Requirements

#### URL Building

Always use a helper to build URLs with query parameters:

```typescript
const buildUrl = (baseUrl: string, queries?: QueryParam) => {
  if (!queries || Object.keys(queries).length === 0) return baseUrl;

  const queryString = buildQueryString(queries);

  return baseUrl.includes("?")
    ? `${baseUrl}&${queryString}`
    : `${baseUrl}?${queryString}`;
};
```

#### Error Handling

**⚠️ ALWAYS generate and throw formatted errors:**

```typescript
try {
  // ... operation
} catch (error: any) {
  throw generateNestErrors(error); // or your error formatter
}
```

#### File Upload Detection

Support both JSON and FormData automatically:

```typescript
const dataToSend = isFileForm(form) ? buildFormData(form) : form;

const { data } = await(
  isFileForm(form)
    ? fileApi.post(fullUrl, dataToSend) // Use file API for FormData
    : authApi.post(fullUrl, dataToSend) // Use auth API for JSON
);
```

#### Soft Delete vs Hard Delete

**🚨 CRITICAL: Always check database schema first!**

```typescript
// changeStateData implementation
export const changeStateData = async (
  name: string,
  id: number,
  queries?: QueryParam
): Promise<CRUDReturn> => {
  try {
    // Check if table has soft delete columns (deleted_at, is_deleted, etc.)
    // IF SOFT DELETE EXISTS:
    //   - Use PUT/PATCH to toggle soft delete state
    //   - Support both delete and restore
    // IF NO SOFT DELETE:
    //   - Use DELETE for hard delete

    const fullUrl = buildUrl(`${API_BASE}/${name}/${id}`, queries);

    // Example for soft delete:
    const { data } = await authApi.put(fullUrl, { deleted: true });

    // Example for hard delete:
    // const { data } = await authApi.delete(fullUrl);

    return data;
  } catch (error: any) {
    throw generateNestErrors(error);
  }
};
```

## 🎣 Generic Queries (`queries/queries.ts`)

### Core Hooks

All generic queries must provide these hooks:

```typescript
// 1. Get data (paginated or full)
useGetData<T>(queryKey: [string, QueryParam])

// 2. Get selection data
useGetSelectionData<T>(name: string, queries?: QueryParam)

// 3. Get one record
useGetOneData<T>(name: string, id: number, queries?: QueryParam)

// 4. Add data mutation
useAddData<T>(name: string, queries?: QueryParam)

// 5. Update data mutation
useUpdateData<T>(name: string, id: number, queries?: QueryParam)

// 6. Change state mutation (delete/restore)
useChangeStateData(name: string, queries?: QueryParam)
```

### Implementation Requirements

#### Query Keys

**⚠️ CRITICAL: Query params come from nuqs!**

```typescript
// Query key structure: [table-name, query-params]
export function useGetData<T>(queryKey: [string, QueryParam]) {
  const [name, params] = queryKey;

  return useQuery({
    queryKey: [name, params],
    queryFn: async (): Promise<PaginationType<T> | T> => {
      return await getData<T>(name, params);
    },
    retry: 0,
  });
}
```

#### Toast Notifications

**🚨 CRITICAL: ALWAYS handle toasts in queries/actions, NEVER in components!**

```typescript
export const useUpdateData = <T>(
  name: string,
  id: number,
  queries?: QueryParam
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: T): Promise<CRUDReturn> =>
      updateData<T>(name, form, id, queries),
    onSuccess: ({ message }) => {
      // ✅ Toast here, not in component
      toast.success(message);

      // Invalidate queries
      invalidateQueries(queryClient, name);
    },
    onError: (error: NestError) => {
      // ✅ Error toast here, not in component
      generateNestErrors(error); // This should handle toast
    },
  });
};
```

#### UI State Management

Support both dialog and sheet patterns:

```typescript
// For sheet-based UI
import { useSheetStore } from "@/lib/store/sheet.store";

export const useAddData = <T>(name: string, queries?: QueryParam) => {
  const queryClient = useQueryClient();
  const { closeSheet } = useSheetStore(); // If using sheets

  return useMutation({
    mutationFn: async (form: T) => addData<T>(name, form, queries),
    onSuccess: ({ message }) => {
      toast.success(message);
      closeSheet(); // or closeDialog() if using dialogs
      invalidateQueries(queryClient, name);
    },
    onError: (error) => generateNestErrors(error),
  });
};
```

#### Query Invalidation

Always invalidate related queries after mutations:

```typescript
const invalidateQueries = (queryClient: QueryClient, name: string) => {
  queryClient.invalidateQueries({ queryKey: [name] });
};
```

#### Conditional Queries

Use `enabled` option for conditional fetching:

```typescript
export const useGetOneData = <T>(
  name: string,
  id: number,
  queries?: QueryParam
) => {
  return useQuery({
    queryKey: [name, id],
    queryFn: (): Promise<T> => getOneData(name, id, queries),
    retry: 0,
    enabled: !!id, // Only fetch when ID is available
  });
};
```

## 📦 Integration with nuqs

Query parameters should ALWAYS come from nuqs state management:

```typescript
// In component
const [search, setSearch] = useQueryState("search");
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
const [filter, setFilter] = useQueryState("filter");

// Pass to query hook
const { data } = useGetData<Link>(["links", { search, page, filter }]);
```

## 🎯 Usage Examples

### Standard CRUD Operations

```typescript
// ✅ GOOD: Use generic hooks
import { useGetData, useAddData, useUpdateData } from "@/queries/queries";

function LinkList() {
  const [search] = useQueryState("search");
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data } = useGetData<Link>(["links", { search, page }]);
  const addLink = useAddData<LinkFormData>("links");

  const handleAdd = (formData: LinkFormData) => {
    addLink.mutate(formData); // Toast handled in hook
  };

  return <div>{/* ... */}</div>;
}
```

### Custom Operations

```typescript
// ❌ DON'T: Create specific file for simple operations
// actions/links.ts - NOT NEEDED
export const getLinks = async () => getData<Link>("links");

// ✅ DO: Create specific file only for complex logic
// actions/links.ts - ONLY IF NEEDED
export const generateShortCode = async (url: string) => {
  // Complex custom logic here
  const shortCode = await customAlgorithm(url);
  return shortCode;
};

// queries/links.ts
export const useGenerateShortCode = () => {
  return useMutation({
    mutationFn: (url: string) => generateShortCode(url),
    onSuccess: (shortCode) => {
      toast.success(`Short code generated: ${shortCode}`);
    },
  });
};
```

### Soft Delete Example

```typescript
// Component using soft delete
import { useChangeStateData } from "@/queries/queries";

function LinkActions({ linkId }: { linkId: number }) {
  const deleteLink = useChangeStateData("links");

  const handleDelete = () => {
    deleteLink.mutate(linkId); // Toast handled in hook
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## 🔒 Type Safety

Always use generic types:

```typescript
// Define types
type Link = {
  id: number;
  url: string;
  code: string;
  deleted_at?: Date | null; // Soft delete column
};

type LinkFormData = Omit<Link, "id" | "deleted_at">;

// Use with hooks
const { data } = useGetData<Link>(["links", params]);
const addLink = useAddData<LinkFormData>("links");
```

## 📋 Checklist

Before creating a new action/query file, ask:

- [ ] Is this a standard CRUD operation? → Use generic functions
- [ ] Does this use standard filtering/pagination? → Use generic functions
- [ ] Does this only need success/error toasts? → Use generic functions
- [ ] Is there complex business logic? → Create specific file
- [ ] Are there multiple related operations? → Create specific file
- [ ] Does it need custom validation? → Create specific file

## 🚫 Common Mistakes

❌ **DON'T create redundant files:**

```typescript
// actions/links.ts - UNNECESSARY
export const getLinks = async () => getData<Link>("links");
export const addLink = async (form) => addData("links", form);
```

❌ **DON'T handle toasts in components:**

```typescript
// Component - WRONG
const addLink = useAddData("links");
addLink.mutate(form, {
  onSuccess: () => toast.success("Success!"), // ❌ NO!
});
```

❌ **DON'T ignore soft delete detection:**

```typescript
// actions.ts - WRONG
export const deleteData = async (name: string, id: number) => {
  // ❌ Always uses hard delete, doesn't check schema
  return authApi.delete(`/api/${name}/${id}`);
};
```

✅ **DO use generic functions:**

```typescript
// Component - CORRECT
import { useGetData, useAddData } from "@/queries/queries";

const { data } = useGetData<Link>(["links", params]);
const addLink = useAddData<LinkFormData>("links");
```

✅ **DO handle toasts in hooks:**

```typescript
// queries.ts - CORRECT
onSuccess: ({ message }) => {
  toast.success(message); // ✅ YES!
  invalidateQueries(queryClient, name);
};
```

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026
