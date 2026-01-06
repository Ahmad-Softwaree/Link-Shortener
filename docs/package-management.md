# Package Management & Tooling Standards

> **⚠️ CRITICAL: This document defines mandatory tooling and dependency management standards for this project.**

## 🎯 Core Principles

### 1. **Bun is the ONLY Package Manager**

**NEVER use npm, yarn, or pnpm.** This project exclusively uses **Bun** for all package management and script execution.

#### ❌ FORBIDDEN Commands

```bash
# NEVER use these:
npm install
npm run dev
npm run build
yarn add
yarn install
pnpm install
```

#### ✅ REQUIRED Commands

```bash
# Package installation
bun install                    # Install all dependencies
bun add <package>              # Add a dependency
bun add -d <package>           # Add a dev dependency
bun remove <package>           # Remove a dependency

# Script execution
bun run dev                    # Development server
bun run build                  # Production build
bun run start                  # Production server
bun run lint                   # Linting

# Database commands
bunx drizzle-kit generate      # Generate migrations
bunx drizzle-kit migrate       # Run migrations
bunx drizzle-kit studio        # Open Drizzle Studio
```

### 2. **Always Use the NEWEST Package Versions**

When adding or updating packages, **ALWAYS install the latest stable version available.**

#### Adding New Packages

```bash
# Correct - installs latest version
bun add next
bun add react
bun add @clerk/nextjs

# For specific latest major version (if needed for compatibility)
bun add next@latest
bun add react@latest
```

#### Updating Existing Packages

```bash
# Update all packages to latest versions
bun update

# Update specific package to latest
bun update <package>

# Check for outdated packages
bunx npm-check-updates
bunx npm-check-updates -u      # Update package.json to latest versions
bun install                     # Install updated versions
```

#### Version Management Rules

- **NO version pinning** unless absolutely required for compatibility
- **NO `~` or `^` prefixes** - let Bun handle version resolution
- **ALWAYS check** for breaking changes in major version updates
- **UPDATE regularly** - don't let dependencies become stale
- **TEST thoroughly** after updating major versions

## 🚀 Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd link-shortener

# Install dependencies with Bun
bun install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Generate database schema
bunx drizzle-kit generate
bunx drizzle-kit migrate

# Start development server
bun run dev
```

### Adding Dependencies

**Before adding any package:**

1. **Verify it's the latest version** - Check npm registry or package homepage
2. **Check compatibility** - Ensure it works with Next.js 16 / React 19
3. **Install with Bun** - Use `bun add` command

```bash
# Example: Adding a new UI library
bun add @radix-ui/react-dialog

# Example: Adding a dev dependency
bun add -d @types/node
```

### Running Scripts

**All scripts MUST be run through Bun:**

```bash
# Development
bun run dev

# Build & Production
bun run build
bun run start

# Code Quality
bun run lint
bun run type-check

# Database
bunx drizzle-kit generate
bunx drizzle-kit migrate
bunx drizzle-kit studio
```

## 📦 Package.json Standards

### Scripts Section

All scripts should be compatible with Bun:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Dependencies Section

- **NO version ranges** that prevent updates (avoid `<`, `>`, `<=`, `>=`)
- **Use `^` for automatic minor/patch updates** (Bun's default)
- **Keep clean** - remove unused dependencies regularly

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## 🔧 Troubleshooting

### Bun Not Installed?

```bash
# Install Bun (Windows with PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"

# Install Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash
```

### Package Installation Issues?

```bash
# Clear Bun cache
rm -rf node_modules
rm bun.lockb
bun install

# Force reinstall
bun install --force
```

### Version Conflicts?

```bash
# Check installed versions
bun pm ls

# Check for updates
bunx npm-check-updates

# Resolve peer dependencies
bun install --peer
```

## ✅ Checklist for LLM Agents

Before generating code that involves dependencies:

- [ ] **Am I using Bun?** (Not npm/yarn/pnpm)
- [ ] **Am I installing the latest version?** (Check package registry)
- [ ] **Are my commands Bun-compatible?** (Use `bun` prefix)
- [ ] **Have I checked for breaking changes?** (Review changelogs for major updates)
- [ ] **Is the package still maintained?** (Check last publish date)

## 📚 Additional Resources

- **Bun Documentation**: https://bun.sh/docs
- **Bun Package Manager**: https://bun.sh/docs/cli/install
- **npm Registry**: https://www.npmjs.com/ (to check latest versions)

---

**Last Updated**: January 6, 2026  
**Version**: 1.0.0
