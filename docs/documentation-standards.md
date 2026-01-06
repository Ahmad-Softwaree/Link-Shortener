# Documentation Standards

> **⚠️ CRITICAL: This document defines mandatory documentation and file organization standards for this project.**

## 🎯 Core Principles

### 1. **NEVER Create .md Files in Root Directory**

**The project root should remain clean and organized.** All documentation files must be properly organized in the `/docs` directory.

#### ❌ FORBIDDEN Practices

```bash
# NEVER create documentation files in root:
project-root/
  ├── README.md              # ✅ Allowed (standard project readme)
  ├── AGENTS.md              # ✅ Allowed (main agent instructions index)
  ├── some-feature.md        # ❌ FORBIDDEN
  ├── instructions.md        # ❌ FORBIDDEN
  ├── notes.md               # ❌ FORBIDDEN
  └── any-other-doc.md       # ❌ FORBIDDEN
```

#### ✅ REQUIRED Structure

```bash
# All documentation belongs in /docs:
project-root/
  ├── README.md              # Project overview
  ├── AGENTS.md              # Agent instructions index
  └── docs/
      ├── authentication.md
      ├── data-fetching.md
      ├── ui-components.md
      ├── documentation-standards.md
      └── [other-docs].md
```

### 2. **AGENTS.md is the Single Entry Point**

**[AGENTS.md](../AGENTS.md) serves as the central index and reference point for all agent instructions.**

#### Rules for AGENTS.md

- **DO** use it as the main entry point for all agent instructions
- **DO** update it when adding new documentation files to `/docs`
- **DO** keep it concise with references to detailed docs
- **DO NOT** include full documentation - only references and overview
- **DO NOT** duplicate content that belongs in `/docs`

#### Adding New Documentation

When creating new instruction documents:

1. **Create** the new `.md` file in `/docs` directory
2. **Name** it descriptively (e.g., `feature-name.md`, `pattern-name.md`)
3. **Update** [AGENTS.md](../AGENTS.md) to reference the new document
4. **Add** it to the appropriate section in AGENTS.md

Example addition to AGENTS.md:

```markdown
### 📝 Documentation

- **[Documentation Standards](docs/documentation-standards.md)** - File organization, documentation structure, and standards
```

## 📁 Documentation Organization

### File Naming Conventions

- **Use kebab-case** for file names: `documentation-standards.md`
- **Be descriptive** but concise: `forms-validation.md` not `form-stuff.md`
- **Use categories** when helpful: `ui-components.md`, `ui-patterns.md`

### Document Structure

Each documentation file should follow this structure:

```markdown
# Title

> **⚠️ CRITICAL: Brief description of what this document defines**

## 🎯 Core Principles

### 1. Main Principle

Content...

### 2. Another Principle

Content...

## 📚 Examples

## ✅ Checklist for LLM Agents

- [ ] Checklist items for agents to verify

---

**Last Updated**: [Date]
**Version**: [Semantic Version]
```

### Content Guidelines

- **Start with critical warnings** for must-follow rules
- **Use emojis sparingly** for visual hierarchy (🎯, ⚠️, ✅, ❌)
- **Include code examples** for common patterns
- **Provide checklists** for LLM agents to follow
- **Keep it concise** - link to external docs for deep dives
- **Update dates** when making changes

## 🚀 Workflow for LLM Agents

### Before Creating ANY Documentation

1. **Check** if the topic fits in an existing doc
2. **Determine** if it should be in `/docs` or just added to AGENTS.md reference
3. **NEVER** create `.md` files in the project root (except README.md and AGENTS.md)
4. **ALWAYS** place documentation in `/docs` directory

### Adding New Documentation

```bash
# 1. Create the new document in /docs
/docs/new-feature.md

# 2. Follow the standard document structure
# 3. Update AGENTS.md to reference it
# 4. Test that links work correctly
```

### Updating Documentation

- **Update the "Last Updated" date** when making changes
- **Increment version** for significant changes
- **Maintain consistency** with existing documentation style
- **Keep AGENTS.md in sync** if references change

## ✅ Checklist for LLM Agents

Before creating or modifying documentation:

- [ ] **Is this a new .md file in root?** (If yes, STOP - use `/docs` instead)
- [ ] **Am I updating AGENTS.md** when adding new docs to `/docs`?
- [ ] **Does the document follow** the standard structure?
- [ ] **Are file names** using kebab-case?
- [ ] **Is the content** clear, concise, and actionable?
- [ ] **Have I included** code examples where helpful?
- [ ] **Did I update** the "Last Updated" date?

## 📝 Summary

**Golden Rules:**

1. ✅ Only `README.md` and `AGENTS.md` are allowed in project root
2. ❌ NEVER create other `.md` files in root
3. ✅ ALWAYS create documentation in `/docs` directory
4. ✅ ALWAYS update `AGENTS.md` when adding new docs
5. ✅ Keep documentation organized, consistent, and up-to-date

---

**Last Updated**: January 6, 2026  
**Version**: 1.0.0
