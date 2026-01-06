# Folder & File Naming Conventions

**⚠️ CRITICAL: READ BEFORE CREATING FILES OR FOLDERS**

This document defines the folder structure and file naming conventions used throughout this project. Consistency is mandatory for maintainability and collaboration.

## 📁 Root Folder Structure

```
/
├── .github/              # GitHub-specific configs and workflows
├── app/                  # Next.js App Router pages
├── components/           # React components
├── containers/           # Page-level container components
├── docs/                 # Documentation files (⚠️ NEVER create .md in root)
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization configs and translations
├── lib/                  # Core utilities, configs, and business logic
├── providers/            # React context providers
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── validation/           # Zod validation schemas
└── [config files]        # Root-level config files only
```

## 🗂️ Detailed Folder Conventions

### `/app` - Next.js Routes

**Pattern**: Follow Next.js App Router conventions

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── globals.css          # Global styles
├── [route]/
│   ├── page.tsx         # Route page component
│   └── layout.tsx       # Route layout (optional)
└── l/
    └── [code]/
        └── route.ts     # API route handler
```

**Rules**:

- Use `page.tsx` for pages
- Use `layout.tsx` for layouts
- Use `route.ts` for API routes
- Use `[param]` for dynamic segments
- Keep route folders lowercase with hyphens

### `/components` - React Components

**Structure**:

```
components/
├── ui/                  # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── [component].tsx
├── shared/              # Shared/reusable components
│   ├── header.tsx
│   ├── Modal.tsx
│   └── Search.tsx
├── forms/               # Form components
│   ├── LinkForm.tsx
│   └── [Entity]Form.tsx
├── cards/               # Card components
│   ├── LinkCard.tsx
│   ├── LinkCard.Simple.tsx
│   └── [Entity]Card.tsx
├── table/               # Table-related components
│   └── data-box.tsx
├── home/                # Page-specific components
│   ├── hero-section.tsx
│   ├── cta-section.tsx
│   └── [section].tsx
├── mode-toggle.tsx      # Top-level utility components
└── lang-toggle.tsx
```

**Naming Rules**:

| Type              | Pattern                      | Example                               |
| ----------------- | ---------------------------- | ------------------------------------- |
| UI Components     | `lowercase-kebab.tsx`        | `button.tsx`, `card.tsx`              |
| Shared Components | `PascalCase.tsx`             | `Modal.tsx`, `AddButton.tsx`          |
| Forms             | `[Entity]Form.tsx`           | `LinkForm.tsx`, `UserForm.tsx`        |
| Cards             | `[Entity]Card.tsx`           | `LinkCard.tsx`                        |
| Card Variants     | `[Entity]Card.[Variant].tsx` | `LinkCard.Simple.tsx`                 |
| Sections          | `[name]-section.tsx`         | `hero-section.tsx`, `cta-section.tsx` |
| Toggles/Utils     | `[name]-toggle.tsx`          | `mode-toggle.tsx`, `lang-toggle.tsx`  |

**Key Principles**:

- `ui/` folder: Always lowercase with hyphens (shadcn convention)
- Other component folders: PascalCase for components
- Group by feature/type, not by component type alone
- Variants use dot notation: `Component.Variant.tsx`

### `/containers` - Page Containers

```
containers/
└── Page.tsx             # Reusable page wrapper component
```

**Pattern**: `PascalCase.tsx`

- Container components that wrap entire pages
- Handle layout logic, data fetching coordination

### `/hooks` - Custom React Hooks

```
hooks/
├── use-date.ts          # Date formatting utilities
└── useAppQuery.tsx      # Query wrapper hook
```

**Naming Rules**:

| Pattern         | When to Use          | Example                      |
| --------------- | -------------------- | ---------------------------- |
| `use-[name].ts` | Simple utility hooks | `use-date.ts`, `use-auth.ts` |
| `use[Name].tsx` | Hooks with JSX       | `useAppQuery.tsx`            |

**Key Principles**:

- Always start with `use` prefix
- Lowercase with hyphens for `.ts` files
- camelCase for `.tsx` files with JSX

### `/i18n` - Internationalization

```
i18n/
├── i18n.ts              # i18next configuration
├── i18next.d.ts         # TypeScript type definitions
└── locale/
    ├── en.json          # English translations
    ├── ar.json          # Arabic translations
    └── ckb.json         # Kurdish translations
```

**Rules**:

- Config files: lowercase with extension `.ts`
- Type definitions: `[name].d.ts`
- Locale files: ISO 639-1 language code + `.json`

### `/lib` - Core Library Code

```
lib/
├── config/              # Configuration files
│   ├── cookie.config.ts
│   └── pagination.config.ts
├── db/                  # Database related
│   ├── index.ts         # Drizzle client export
│   └── schema.ts        # Database schema
├── react-query/         # TanStack Query setup
│   ├── keys.ts          # Query key factories
│   ├── actions/
│   │   └── [entity].action.ts
│   └── queries/
│       └── [entity].query.ts
├── store/               # Zustand state management
│   ├── modal.store.ts
│   └── [name].store.ts
├── enums.ts             # App-wide enums and constants
├── urls.ts              # Route URL constants
├── utils.ts             # General utility functions
└── functions.ts         # Business logic functions
```

**Naming Conventions**:

| File Type | Pattern               | Example                                    |
| --------- | --------------------- | ------------------------------------------ |
| Config    | `[name].config.ts`    | `cookie.config.ts`, `pagination.config.ts` |
| Store     | `[name].store.ts`     | `modal.store.ts`, `filter.store.ts`        |
| Actions   | `[entity].action.ts`  | `links.action.ts`, `users.action.ts`       |
| Queries   | `[entity].query.ts`   | `links.query.ts`, `users.query.ts`         |
| Utils     | `[purpose].ts`        | `utils.ts`, `functions.ts`                 |
| Constants | `[type]s.ts` (plural) | `urls.ts`, `enums.ts`                      |
| Keys      | `keys.ts`             | `keys.ts` (for query keys)                 |

**Key Principles**:

- Config files get `.config.ts` suffix
- Store files get `.store.ts` suffix
- Actions and queries named after entity (plural)
- Use `index.ts` for main exports from a folder

### `/providers` - React Context Providers

```
providers/
├── query-provider.tsx
├── language-provider.tsx
└── theme-provider.tsx
```

**Pattern**: `[name]-provider.tsx`

- Always lowercase with hyphens
- Always end with `-provider`
- Contains React context setup

### `/public` - Static Assets

```
public/
├── fonts/
│   ├── [FontName]/
│   └── [font-files]
├── images/
│   ├── screenshots/
│   └── [image-files]
└── [static-files]
```

**Rules**:

- Fonts: Organized by font family name (PascalCase folder)
- Images: Organized by category (lowercase folders)
- All static files should be in meaningful subfolders

### `/types` - TypeScript Definitions

```
types/
├── global.ts            # Global type definitions
├── routes.d.ts          # Route type definitions (auto-generated)
└── cache-life.d.ts      # Cache configuration types
```

**Naming Rules**:

| Type              | Pattern        | Example                          |
| ----------------- | -------------- | -------------------------------- |
| Global types      | `global.ts`    | `global.ts`                      |
| Type declarations | `[name].d.ts`  | `routes.d.ts`, `cache-life.d.ts` |
| Feature types     | `[feature].ts` | `auth.ts`, `api.ts`              |

**Key Principles**:

- Use `.d.ts` for ambient type declarations
- Use `.ts` for exported types and interfaces
- Keep global types in `global.ts`

### `/validation` - Zod Schemas

```
validation/
├── links.ts             # Link validation schemas
└── [entity].ts          # Entity validation schemas
```

**Pattern**: `[entity].ts` (plural form)

- Named after the entity being validated
- Use plural form matching database table names
- Export validation schema and inferred types

### `/docs` - Documentation

```
docs/
├── authentication.md
├── data-fetching.md
├── internationalization.md
└── [topic].md
```

**Pattern**: `[topic].md` (lowercase with hyphens)

**⚠️ CRITICAL**: NEVER create `.md` files in the root directory. All documentation goes in `/docs`.

## 📄 File Naming Rules Summary

### TypeScript/JavaScript Files

| File Type                | Extension | Pattern               | Example                    |
| ------------------------ | --------- | --------------------- | -------------------------- |
| React Component (shared) | `.tsx`    | `PascalCase.tsx`      | `Modal.tsx`                |
| React Component (ui)     | `.tsx`    | `lowercase-kebab.tsx` | `button.tsx`               |
| Hook (utility)           | `.ts`     | `use-[name].ts`       | `use-date.ts`              |
| Hook (with JSX)          | `.tsx`    | `use[Name].tsx`       | `useAppQuery.tsx`          |
| Utility function         | `.ts`     | `[purpose].ts`        | `utils.ts`, `functions.ts` |
| Configuration            | `.ts`     | `[name].config.ts`    | `cookie.config.ts`         |
| Store                    | `.ts`     | `[name].store.ts`     | `modal.store.ts`           |
| Action                   | `.ts`     | `[entity].action.ts`  | `links.action.ts`          |
| Query                    | `.ts`     | `[entity].query.ts`   | `links.query.ts`           |
| Validation               | `.ts`     | `[entity].ts`         | `links.ts`                 |
| Types (ambient)          | `.d.ts`   | `[name].d.ts`         | `global.d.ts`              |
| Constants                | `.ts`     | `[type]s.ts`          | `urls.ts`, `enums.ts`      |

### Special Files

| File           | Purpose                      | Pattern                              |
| -------------- | ---------------------------- | ------------------------------------ |
| `enums.ts`     | App-wide constants and enums | Singular, exports `ENUMs` object     |
| `urls.ts`      | Route URL constants          | Singular, exports `URLs` object      |
| `keys.ts`      | Query key factories          | Singular, exports key factories      |
| `utils.ts`     | General utilities            | Singular, mixed utility functions    |
| `functions.ts` | Business logic               | Singular, domain-specific functions  |
| `index.ts`     | Barrel exports               | Re-exports from folder               |
| `schema.ts`    | Database schema              | Singular, Drizzle schema definitions |

## 🎯 Content Patterns

### `enums.ts` Pattern

```typescript
export const ENUMs = {
  [CATEGORY]: {
    [CONSTANT_NAME]: "value",
  },
} as const;
```

**Example**:

```typescript
export const ENUMs = {
  GLOBAL: {
    DEFAULT_LANG: "en",
    LANG_COOKIE: "lang",
  },
  PARAMS: {
    SEARCH: "search",
    LIMIT: "limit",
  },
} as const;
```

### `urls.ts` Pattern

```typescript
export const URLs = {
  [ROUTE_NAME]: "/path",
} as const;
```

**Example**:

```typescript
export const URLs = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  REDIRECT: "/l",
} as const;
```

### `keys.ts` Pattern (TanStack Query)

```typescript
export const [entity] = {
  all: () => ["[entity]"] as const,
  lists: () => [...[entity].all(), "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...[entity].lists(), filters] as const,
  details: () => [...[entity].all(), "detail"] as const,
  detail: (id: number) => [...[entity].details(), id] as const,
};
```

**Example**:

```typescript
export const links = {
  all: () => ["links"] as const,
  lists: () => [...links.all(), "list"] as const,
  list: (filters?: Record<string, any>) => [...links.lists(), filters] as const,
  details: () => [...links.all(), "detail"] as const,
  detail: (id: number) => [...links.details(), id] as const,
};
```

### Store Pattern (Zustand)

**File**: `[name].store.ts`

```typescript
import { create } from "zustand";

interface [Name]State {
  // State properties
}

interface [Name]Actions {
  // Action methods
}

export const use[Name]Store = create<[Name]State & [Name]Actions>((set) => ({
  // Implementation
}));
```

### Validation Pattern (Zod)

**File**: `[entity].ts`

```typescript
import { z } from "zod";
import { TFunction } from "i18next";

export const get[Entity]Validation = (t: TFunction) =>
  z.object({
    // Schema definition with translations
  });

export type [Entity]Input = z.infer<ReturnType<typeof get[Entity]Validation>>;
```

## ✅ Best Practices

### DO

- ✅ Use lowercase with hyphens for `ui/` components
- ✅ Use PascalCase for other React components
- ✅ Use `.config.ts` suffix for configuration files
- ✅ Use `.store.ts` suffix for Zustand stores
- ✅ Use `.action.ts` for server actions
- ✅ Use `.query.ts` for TanStack Query hooks
- ✅ Use `.d.ts` for ambient type declarations
- ✅ Group related files in feature folders
- ✅ Use `index.ts` for barrel exports
- ✅ Name validation files after entities (plural)
- ✅ Keep all documentation in `/docs`

### DON'T

- ❌ Don't mix naming conventions within the same folder
- ❌ Don't create `.md` files in root
- ❌ Don't use camelCase for file names (except hooks)
- ❌ Don't create deeply nested folder structures (max 3-4 levels)
- ❌ Don't put components in `/lib`
- ❌ Don't put utilities in `/components`
- ❌ Don't mix business logic with UI components
- ❌ Don't use abbreviations in file names
- ❌ Don't create generic folder names like `/misc` or `/other`

## 📋 Quick Reference Checklist

When creating a new file, ask:

1. ☐ Is it a React component? → `/components/[category]/[Name].tsx`
2. ☐ Is it a custom hook? → `/hooks/use-[name].ts`
3. ☐ Is it a utility function? → `/lib/[purpose].ts`
4. ☐ Is it a configuration? → `/lib/config/[name].config.ts`
5. ☐ Is it state management? → `/lib/store/[name].store.ts`
6. ☐ Is it a server action? → `/lib/react-query/actions/[entity].action.ts`
7. ☐ Is it a TanStack Query hook? → `/lib/react-query/queries/[entity].query.ts`
8. ☐ Is it validation? → `/validation/[entity].ts`
9. ☐ Is it a type definition? → `/types/[name].ts` or `/types/[name].d.ts`
10. ☐ Is it documentation? → `/docs/[topic].md`

## 🚀 Examples by Feature

### Adding a New Entity (e.g., "Users")

```
lib/
├── react-query/
│   ├── actions/
│   │   └── users.action.ts      # Server actions
│   └── queries/
│       └── users.query.ts       # Query hooks
└── db/
    └── schema.ts                # Add users table

types/
└── global.ts                    # Add User type

validation/
└── users.ts                     # Zod schema

components/
├── forms/
│   └── UserForm.tsx             # User form component
└── cards/
    └── UserCard.tsx             # User card component
```

### Adding a New Feature Section

```
components/
└── [feature-name]/
    ├── [component]-section.tsx
    └── [helper-component].tsx

app/
└── [feature-name]/
    ├── page.tsx
    └── layout.tsx
```

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026
