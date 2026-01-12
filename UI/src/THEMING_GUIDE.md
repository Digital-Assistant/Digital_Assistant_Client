# Widget Theming Guide

## Overview
This widget uses a comprehensive theming system built on HSL-based CSS custom properties mapped to Tailwind utility classes. HSL (Hue, Saturation, Lightness) enables smooth opacity modifiers and easier color manipulation.

## Architecture

### 1. CSS Custom Properties (`/styles/globals.css`)
All colors are defined using HSL format in the `:root` selector with automatic dark mode support:

```css
:root {
  /* Widget-specific theme tokens (HSL) */
  --widget-panel-bg: 0 0% 100%;
  --widget-panel-border: 0 0% 90%;
  --widget-panel-shadow: 0 0% 0% / 0.15;
  
  /* Text colors */
  --widget-text-primary: 240 4% 11%;
  --widget-text-secondary: 0 0% 59%;
  --widget-text-on-dark: 0 0% 100%;
  
  /* Icon colors */
  --widget-icon-primary: 0 0% 0%;
  --widget-icon-secondary: 0 0% 59%;
  --widget-icon-disabled: 0 0% 80%;
  --widget-icon-active: 0 0% 0%;
  
  /* Status colors */
  --widget-status-success: 128 69% 44%;
  --widget-status-error: 359 100% 70%;
  --widget-status-warning: 39 100% 50%;
  --widget-status-info: 211 100% 50%;
  
  /* Interactive elements */
  --widget-button-primary-bg: 0 0% 0%;
  --widget-button-primary-text: 0 0% 100%;
  --widget-button-hover-opacity: 0.7;
  
  /* Input fields */
  --widget-input-bg: 0 0% 85%;
  --widget-input-border: 0 0% 82%;
  --widget-input-shadow: 0 0% 0% / 0.25;
  
  /* Dialog/Modal */
  --widget-dialog-bg: 0 0% 100%;
  --widget-dialog-overlay: 0 0% 0% / 0.5;
  --widget-dialog-border: 0 0% 0%;
  
  /* Tab colors */
  --widget-tab-active-bg: 0 0% 0%;
  --widget-tab-active-text: 0 0% 100%;
  --widget-tab-inactive-bg: 0 0% 100%;
  --widget-tab-inactive-text: 0 0% 0%;
  --widget-tab-inactive-border: 0 0% 0%;
  
  /* Recording card */
  --widget-card-bg: 0 0% 100%;
  --widget-card-border: 0 0% 90%;
  --widget-card-hover-shadow: 0 0% 0% / 0.1;
  
  /* Border radius */
  --widget-radius-sm: 4px;
  --widget-radius-md: 8px;
  --widget-radius-lg: 12px;
  --widget-radius-full: 9999px;
}

.dark {
  /* Widget-specific theme tokens - Dark Mode */
  --widget-panel-bg: 240 10% 12%;
  --widget-panel-border: 240 4% 20%;
  --widget-panel-shadow: 0 0% 0% / 0.5;
  
  /* Text colors - Dark Mode */
  --widget-text-primary: 0 0% 98%;
  --widget-text-secondary: 0 0% 65%;
  --widget-text-on-dark: 0 0% 100%;
  
  /* Icon colors - Dark Mode */
  --widget-icon-primary: 0 0% 100%;
  --widget-icon-secondary: 0 0% 65%;
  --widget-icon-disabled: 0 0% 40%;
  --widget-icon-active: 0 0% 100%;
  
  /* Status colors - Dark Mode */
  --widget-status-success: 142 71% 45%;
  --widget-status-error: 0 84% 60%;
  --widget-status-warning: 38 92% 50%;
  --widget-status-info: 199 89% 48%;
  
  /* Interactive elements - Dark Mode */
  --widget-button-primary-bg: 0 0% 100%;
  --widget-button-primary-text: 0 0% 0%;
  --widget-button-hover-opacity: 0.8;
  
  /* Input fields - Dark Mode */
  --widget-input-bg: 240 4% 16%;
  --widget-input-border: 240 4% 24%;
  --widget-input-shadow: 0 0% 0% / 0.4;
  
  /* Dialog/Modal - Dark Mode */
  --widget-dialog-bg: 240 10% 15%;
  --widget-dialog-overlay: 0 0% 0% / 0.7;
  --widget-dialog-border: 240 4% 24%;
  
  /* Tab colors - Dark Mode */
  --widget-tab-active-bg: 0 0% 100%;
  --widget-tab-active-text: 0 0% 0%;
  --widget-tab-inactive-bg: 240 10% 12%;
  --widget-tab-inactive-text: 0 0% 100%;
  --widget-tab-inactive-border: 240 4% 24%;
  
  /* Recording card - Dark Mode */
  --widget-card-bg: 240 10% 15%;
  --widget-card-border: 240 4% 20%;
  --widget-card-hover-shadow: 0 0% 100% / 0.05;
}
```

### Why HSL?
1. **Opacity Modifiers**: Use `hsl(var(--color) / 0.5)` for 50% opacity
2. **Color Manipulation**: Easily adjust lightness/saturation
3. **Better Dark Mode**: Smoother transitions between light and dark themes
4. **Modern Standard**: Native browser support, no conversion needed

### 2. Tailwind Configuration (`/tailwind.config.js`)

All semantic color names are mapped to CSS variables in the Tailwind config, allowing you to use clean utility classes:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Base semantic colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        
        // Widget-specific semantic colors
        widget: {
          panel: {
            DEFAULT: "var(--widget-panel-bg)",
            border: "var(--widget-panel-border)",
          },
          text: {
            primary: "var(--widget-text-primary)",
            secondary: "var(--widget-text-secondary)",
            "on-dark": "var(--widget-text-on-dark)",
          },
          icon: {
            primary: "var(--widget-icon-primary)",
            secondary: "var(--widget-icon-secondary)",
            disabled: "var(--widget-icon-disabled)",
            active: "var(--widget-icon-active)",
          },
          // ... more widget colors
        },
      },
      borderRadius: {
        "widget-sm": "var(--widget-radius-sm)",
        "widget-md": "var(--widget-radius-md)",
        "widget-lg": "var(--widget-radius-lg)",
      },
      opacity: {
        "widget-hover": "var(--widget-button-hover-opacity)",
      },
    },
  },
};
```

### 3. Using Theme Variables in Components

Use the `cn()` utility function from `/lib/cn.ts` for conditional class management:

```tsx
import { cn } from "../lib/cn";

// Example 1: Using semantic color classes (PREFERRED)
<div className={cn(
  "p-4 rounded-widget-sm",
  "bg-widget-panel",
  "border border-widget-panel-border",
  "text-widget-text-primary"
)}>
  Content
</div>

// Example 2: Using var() for SVG fills or dynamic values
<svg>
  <path fill="var(--widget-icon-primary)" />
</svg>

// Example 3: Conditional styling
<button className={cn(
  "px-4 py-2 rounded-widget-sm transition-opacity",
  "bg-widget-button-primary",
  "text-widget-button-primary-text",
  "hover:opacity-widget-hover",
  isActive && "bg-widget-status-success"
)}>
  Click me
</button>
```

### 4. Reusable Components

The following components are available for consistent styling:

#### IconButton (`/components/IconButton.tsx`)
```tsx
import { IconButton } from "./IconButton";

<IconButton 
  onClick={handleClick}
  size="md" // "sm" | "md" | "lg"
  aria-label="Description"
>
  <svg>...</svg>
</IconButton>
```

## Customization Guide

### Changing the Theme

To customize the widget's appearance, modify the CSS variables in `/styles/globals.css`:

```css
:root {
  /* Change primary color scheme */
  --widget-button-primary-bg: #007aff;  /* Blue instead of black */
  --widget-icon-primary: #007aff;
  
  /* Change success color */
  --widget-status-success: #34c759;
  
  /* Adjust border radius for rounder corners */
  --widget-radius-sm: 8px;
  --widget-radius-md: 12px;
  --widget-radius-lg: 16px;
}
```

### Dark Mode Support

Add a `.dark` class variant in globals.css:

```css
.dark {
  --widget-panel-bg: #1c1c1e;
  --widget-text-primary: #ffffff;
  --widget-text-secondary: #8e8e93;
  --widget-icon-primary: #ffffff;
  /* ... other dark mode colors */
}
```

### Creating Custom Themes

Create multiple theme classes:

```css
/* Blue Theme */
.theme-blue {
  --widget-button-primary-bg: #007aff;
  --widget-icon-primary: #007aff;
  --widget-status-success: #34c759;
}

/* Purple Theme */
.theme-purple {
  --widget-button-primary-bg: #af52de;
  --widget-icon-primary: #af52de;
  --widget-status-success: #32d74b;
}
```

Apply theme programmatically:
```tsx
<div className="theme-blue">
  {/* Widget content */}
</div>
```

## Best Practices

1. **Always use semantic tokens**: Use `var(--widget-text-primary)` instead of hardcoded colors
2. **Use the cn() utility**: For better class management and avoiding conflicts
3. **Maintain consistency**: Use the IconButton component instead of creating new button styles
4. **Test theme changes**: Ensure all interactive states (hover, active, disabled) work correctly
5. **Document custom tokens**: If adding new variables, document them in this guide

## Token Categories

### Color Tokens
- **Panel**: Background, borders, shadows for main containers
- **Text**: Primary, secondary, and on-dark text colors
- **Icon**: Primary, secondary, disabled, and active states
- **Status**: Success, error, warning, info states
- **Interactive**: Button backgrounds, text, hover states
- **Input**: Input field backgrounds, borders, shadows
- **Dialog**: Modal/dialog backgrounds, overlays, borders
- **Tab**: Active/inactive tab styles
- **Card**: Recording card backgrounds, borders, hover effects

### Spacing & Layout Tokens
- **Radius**: sm (4px), md (8px), lg (12px), full (9999px)

## Migration Notes

All components have been refactored to use:
1. CSS custom properties for all colors
2. The `cn()` utility for class management
3. Semantic color tokens instead of hardcoded values
4. Reusable sub-components (IconButton, etc.)

## Examples

### Before (Hardcoded)
```tsx
<button className="bg-black text-white hover:opacity-70">
  Click me
</button>
```

### After (Themed with Tailwind Utilities)
```tsx
<button className={cn(
  "bg-widget-button-primary",
  "text-widget-button-primary-text",
  "hover:opacity-widget-hover"
)}>
  Click me
</button>
```

### Comparison Table

| Approach | Usage | Example |
|----------|-------|---------|
| **Tailwind Utilities** (Preferred) | Use for backgrounds, text colors, borders | `bg-widget-panel text-widget-text-primary border-widget-panel-border` |
| **CSS var()** | Use for SVG fills, dynamic values, shadows | `fill="var(--widget-icon-primary)"` `shadow-[0px_2px_4px_var(--widget-input-shadow)]` |

## Quick Reference: Common Utility Classes

### Backgrounds
- `bg-widget-panel` - Main panel background
- `bg-widget-dialog` - Dialog/modal background
- `bg-widget-input` - Input field background
- `bg-widget-button-primary` - Primary button background
- `bg-widget-card` - Card background

### Text Colors
- `text-widget-text-primary` - Primary text
- `text-widget-text-secondary` - Secondary/muted text
- `text-widget-text-on-dark` - Text on dark backgrounds
- `text-widget-button-primary-text` - Button text color

### Borders
- `border-widget-panel-border` - Panel borders
- `border-widget-input-border` - Input borders
- `border-widget-card-border` - Card borders

### Border Radius
- `rounded-widget-sm` - Small radius (4px)
- `rounded-widget-md` - Medium radius (8px)
- `rounded-widget-lg` - Large radius (12px)
- `rounded-widget-full` - Full/pill radius (9999px)

### Opacity
- `opacity-widget-hover` - Hover state opacity (0.7)
- `hover:opacity-widget-hover` - Apply on hover

### Status Colors (via var())
```tsx
// Success
fill="var(--widget-status-success)"

// Error
fill="var(--widget-status-error)"

// Warning
fill="var(--widget-status-warning)"

// Info
fill="var(--widget-status-info)"
```