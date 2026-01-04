# UI Components (shadcn/ui)

## Overview

This project uses **shadcn/ui** components exclusively for all UI elements. Custom components should NOT be created unless absolutely necessary and approved.

## Configuration

- **Style**: New York
- **Framework**: React Server Components (RSC)
- **Icon Library**: Lucide React
- **CSS**: Tailwind CSS 4 with CSS variables
- **Base Color**: Neutral

## Core Principles

### ✅ DO

- **Use shadcn/ui components** for all UI elements (buttons, inputs, dialogs, etc.)
- **Install new components** when needed: `npx shadcn@latest add <component>`
- **Compose existing components** to build complex UIs
- **Use the `cn()` utility** from `@/lib/utils` for conditional styling
- **Follow New York style** conventions for component variants

### ❌ DON'T

- **Create custom components** that replicate shadcn/ui functionality
- **Modify core shadcn/ui components** without good reason
- **Use other UI libraries** (Material-UI, Chakra, etc.)
- **Write custom form controls** when shadcn/ui alternatives exist

## Component Import Pattern

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
```

## Common Components

### Forms

- `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`
- `<Input>`, `<Textarea>`, `<Select>`, `<Checkbox>`, `<RadioGroup>`

### Dialogs & Overlays

- `<Dialog>`, `<Sheet>`, `<Popover>`, `<Tooltip>`, `<DropdownMenu>`

### Feedback

- `<Alert>`, `<Toast>`, `<Badge>`, `<Skeleton>`

### Navigation

- `<Tabs>`, `<Accordion>`, `<NavigationMenu>`

### Data Display

- `<Table>`, `<Card>`, `<Avatar>`, `<Separator>`

## Adding New Components

When you need a component not yet in the project:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## Styling Components

Use Tailwind classes and the `cn()` utility for styling:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomButton({ className, ...props }) {
  return (
    <Button
      className={cn("bg-primary hover:bg-primary/90", className)}
      {...props}
    />
  );
}
```

## Component Variants

shadcn/ui components support variants through props:

```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

## Best Practices

1. **Component Composition**: Combine shadcn/ui components to create feature-specific components
2. **Consistent Variants**: Use the built-in variants consistently across the app
3. **Accessibility**: shadcn/ui components are accessible by default—don't remove ARIA attributes
4. **Type Safety**: Use TypeScript props provided by shadcn/ui components
5. **Server First**: Most shadcn/ui components work with Server Components unless they require interactivity

## Example Usage

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LinkForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shorten URL</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input type="url" placeholder="Enter your long URL" />
          <Button type="submit" className="w-full">
            Shorten
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component List](https://ui.shadcn.com/docs/components)
- [Themes & Customization](https://ui.shadcn.com/themes)

---

**Last Updated**: January 4, 2026
