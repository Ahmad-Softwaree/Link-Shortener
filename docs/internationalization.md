# Internationalization (i18n) with i18next

**⚠️ CRITICAL: READ BEFORE IMPLEMENTING MULTI-LANGUAGE FEATURES**

This document outlines the internationalization standards and patterns used in this project with **i18next** and **react-i18next**.

## 📋 Overview

This project uses **i18next** for multi-language support with the following languages:

- **English (en)** - Default language, LTR
- **Arabic (ar)** - RTL
- **Kurdish/Sorani (ckb)** - RTL

## 🏗️ Architecture

### Directory Structure

```
i18n/
  ├── i18n.ts              # i18next configuration
  ├── i18next.d.ts         # TypeScript type definitions
  └── locale/
      ├── en.json          # English translations
      ├── ar.json          # Arabic translations
      └── ckb.json         # Kurdish translations
```

### Configuration File

**File**: `i18n/i18n.ts`

```typescript
import i18n from "i18next";
import en from "./locale/en.json";
import ar from "./locale/ar.json";
import ckb from "./locale/ckb.json";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    ckb: { translation: ckb },
  },
  fallbackLng: ["en", "ckb", "ar"],
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Key Points**:

- Import all locale JSON files
- Use `initReactI18next` plugin
- Set fallback languages (English first)
- Disable HTML escaping with `escapeValue: false`

### TypeScript Definitions

**File**: `i18n/i18next.d.ts`

```typescript
import "i18next";
import en from "./locale/en.json";
import ar from "./locale/ar.json";
import ckb from "./locale/ckb.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ckb";
    resources: {
      en: typeof en;
      ar: typeof ar;
      ckb: typeof ckb;
    };
  }
}
```

**Benefits**:

- Full TypeScript autocomplete for translation keys
- Type safety for all translations
- Compile-time errors for missing keys

## 🎨 Language Provider

**File**: `providers/language-provider.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { getCookie } from "@/lib/config/cookie.config";
import { ENUMs } from "@/lib/enums";
import i18n from "@/i18n/i18n";

function LanguageSetup() {
  useEffect(() => {
    const cookieLang = getCookie(ENUMs.GLOBAL.LANG_COOKIE);
    let langToUse = ENUMs.GLOBAL.DEFAULT_LANG as string;

    if (cookieLang && i18n.languages.includes(cookieLang)) {
      langToUse = cookieLang;
    }

    i18n.changeLanguage(langToUse);

    document.body.classList.remove(
      "english_font",
      "arabic_font",
      "kurdish_font"
    );

    if (langToUse === "en") {
      document.body.classList.add("english_font");
      document.dir = "ltr";
    } else if (langToUse === "ar") {
      document.body.classList.add("arabic_font");
      document.dir = "rtl";
    } else if (langToUse === "ckb") {
      document.body.classList.add("kurdish_font");
      document.dir = "rtl";
    }
  }, []);

  return null;
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageSetup />
      {children}
    </I18nextProvider>
  );
}
```

**Key Responsibilities**:

1. Wrap app with `I18nextProvider`
2. Check for saved language in cookies
3. Apply language change on mount
4. Set text direction (`ltr` or `rtl`)
5. Apply language-specific font classes

## 🔄 Language Toggle Component

**File**: `components/lang-toggle.tsx`

```typescript
export const setLanguage = (selectedLang: string) => {
  setCookie(ENUMs.GLOBAL.LANG_COOKIE, selectedLang);
  document.body.classList.remove("english_font", "arabic_font", "kurdish_font");

  if (selectedLang === "en") {
    document.body.classList.add("english_font");
    document.dir = "ltr";
  } else if (selectedLang === "ar") {
    document.body.classList.add("arabic_font");
    document.dir = "rtl";
  } else if (selectedLang === "ckb") {
    document.body.classList.add("kurdish_font");
    document.dir = "rtl";
  }
};

export function LangToggle() {
  const { i18n } = useTranslation();

  const setSelectedLang = (selectedLang: string) => {
    i18n.changeLanguage(selectedLang);
    setLanguage(selectedLang);
  };

  return <DropdownMenu>{/* Dropdown implementation */}</DropdownMenu>;
}
```

**Pattern**:

- Export `setLanguage` helper function
- Change i18n language
- Save to cookie
- Update DOM classes and direction
- Dynamic language list from i18n resources

## 📝 Translation JSON Structure

**File**: `i18n/locale/en.json`

```json
{
  "app": {
    "title": "Link Shortener",
    "description": "Shorten your links with ease"
  },
  "header": {
    "sign_in": "Sign In",
    "sign_up": "Sign Up"
  },
  "home": {
    "hero": {
      "title_line1": "Shorten Your Links,",
      "description": "Transform long URLs..."
    }
  }
}
```

**Standards**:

- Use nested objects for organization
- Group by feature/section (e.g., `home`, `header`, `dashboard`)
- Use descriptive, hierarchical keys
- Keep structure identical across all language files
- All JSON files must have the exact same keys

## 🎯 Usage in Components

### Client Components

```typescript
"use client";

import { useTranslation } from "react-i18next";

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home.hero.title_line1")}</h1>
      <p>{t("home.hero.description")}</p>
    </div>
  );
}
```

### Server Components

**⚠️ IMPORTANT**: i18next does NOT work in Server Components by default. For translations in Server Components, you must:

1. Use Client Components for translated content
2. Pass translations as props from Client Components
3. Or use a server-side i18n solution (not currently implemented)

**Current Pattern**: Wrap sections that need translations in Client Components with `"use client"` directive.

## 🍪 Cookie Management

**File**: `lib/config/cookie.config.ts`

```typescript
import Cookies from "js-cookie";

export const setCookie = (name: string, value: string, days: number = 365) => {
  Cookies.set(name, value, { expires: days });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};
```

**Package**: `js-cookie`

**Usage**:

- Cookie name: defined in `ENUMs.GLOBAL.LANG_COOKIE`
- Default expiry: 365 days
- Persists user language preference

## ⚙️ Configuration Constants

**File**: `lib/enums.ts`

```typescript
export const ENUMs = {
  GLOBAL: {
    DEFAULT_LANG: "en",
    LANG_COOKIE: "lang",
  },
};
```

## 🎨 Font & Direction Handling

### CSS Classes

**File**: `app/globals.css`

```css
.english_font {
  /* English font styles */
}

.arabic_font {
  /* Arabic font styles */
}

.kurdish_font {
  /* Kurdish font styles */
}
```

### RTL Support

**Always set text direction on the body element**:

```typescript
document.dir = "ltr"; // For English
document.dir = "rtl"; // For Arabic/Kurdish
```

## 🔄 Adding a New Language

1. **Create translation file**: `i18n/locale/[lang-code].json`
2. **Import in i18n.ts**:
   ```typescript
   import newLang from "./locale/new-lang.json";
   ```
3. **Add to resources**:
   ```typescript
   resources: {
     en: { translation: en },
     newLang: { translation: newLang },
   }
   ```
4. **Update TypeScript definitions** in `i18next.d.ts`
5. **Add font class** in `globals.css`
6. **Update LanguageSetup** and `setLanguage` functions
7. **Add language names** to translation files:
   ```json
   "langs": {
     "newLang": "New Language Name"
   }
   ```

## 📚 Best Practices

### ✅ DO

- Always use the `t()` function for user-facing text
- Keep translation keys descriptive and hierarchical
- Maintain identical structure across all language files
- Use `"use client"` for components with translations
- Test with all languages, especially RTL
- Use TypeScript autocomplete for translation keys
- Store language preference in cookies

### ❌ DON'T

- Don't hardcode user-facing strings
- Don't use translations in Server Components without proper setup
- Don't forget to add new keys to ALL language files
- Don't nest keys too deeply (max 3-4 levels)
- Don't use special characters in translation keys
- Don't forget to set text direction for RTL languages

## 🚀 Quick Start Checklist

When adding new translatable content:

1. ☐ Add translation keys to all JSON files (`en.json`, `ar.json`, `ckb.json`)
2. ☐ Use `"use client"` directive if component is currently a Server Component
3. ☐ Import `useTranslation` hook
4. ☐ Use `t("your.key.path")` for translations
5. ☐ Test in all languages
6. ☐ Verify RTL layout for Arabic/Kurdish

## 📦 Required Packages

```json
{
  "dependencies": {
    "i18next": "latest",
    "react-i18next": "latest",
    "js-cookie": "latest"
  },
  "devDependencies": {
    "@types/js-cookie": "latest"
  }
}
```

Install with: `bun add i18next react-i18next js-cookie`

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026
