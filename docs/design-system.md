# Finch Design System

## Color Tokens

### Base Palette
All colors are defined as Tailwind config extensions and referenced via semantic names.

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAFAFA` | App background |
| `surface` | `#FFFFFF` | Cards, panels, sidebar |
| `border` | `#E5E7EB` | Dividers, card outlines |
| `muted` | `#F3F4F6` | Table headers, pill backgrounds |
| `muted-foreground` | `#6B7280` | Secondary text, labels |
| `foreground` | `#111827` | Primary text |

### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `positive` | `#16A34A` | Income, gains, good scores |
| `negative` | `#DC2626` | Expenses, losses, budget overruns |
| `warning` | `#D97706` | Near-limit budgets, caution states |
| `brand` | `#6366F1` | Primary accent, charts, active states |

### Component Colors
| Token | Value | Usage |
|---|---|---|
| `primary.DEFAULT` | `#18181B` | Primary button backgrounds |
| `primary.foreground` | `#FAFAFA` | Text on primary buttons |
| `accent.DEFAULT` | `#F4F4F5` | Active nav items, hover states |
| `accent.foreground` | `#18181B` | Text in accent contexts |

---

## Typography

**Font stack:** `-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif`

Finch uses the system font stack to feel native on each platform. On macOS this is SF Pro, on Windows it is Segoe UI, on Linux it falls through to Inter if installed.

### Scale
| Usage | Size | Weight | Class |
|---|---|---|---|
| Page headings (TopBar) | 14px | 600 | `text-sm font-semibold` |
| Section headings | 14px | 600 | `text-sm font-semibold` |
| Body copy | 14px | 400 | `text-sm` |
| KPI values (large) | 24px | 600 | `text-2xl font-semibold tabular-nums` |
| KPI values (xl) | 30px | 600 | `text-3xl font-semibold tabular-nums` |
| Labels / metadata | 12px | 500 | `text-xs font-medium` |
| Overline labels | 12px | 500 + uppercase | `text-xs font-medium uppercase tracking-wide` |
| Table body | 14px | 500 | `text-sm font-medium` |

**Tabular nums:** All financial figures use `tabular-nums` for alignment.

**Anti-aliasing:** `font-smoothing: antialiased` is applied globally for crispness on retina displays.

---

## Spacing

Finch uses an 8px base unit via Tailwind's default spacing scale (1 unit = 4px).

| Context | Value |
|---|---|
| Page padding | `p-6` (24px) |
| Card padding (default) | `p-5` (20px) |
| Card padding (compact) | `p-4` (16px) |
| Section gap | `space-y-6` (24px) |
| Item gap in lists | `space-y-2` or `divide-y divide-border` |
| Nav item padding | `px-2.5 py-2` |

---

## Border Radius

| Size | Value | Usage |
|---|---|---|
| `sm` | `0.375rem` (6px) | Inputs, small badges |
| `md` | `0.5rem` (8px) | Buttons, dropdowns |
| `lg` | `0.75rem` (12px) | Cards, panels |
| `full` | `9999px` | Pill badges, progress bars |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Default card elevation |
| `shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | Hovered cards, tooltips |
| `shadow-subtle` | `0 1px 2px rgba(0,0,0,0.04)` | Active toggle segments |

---

## Animation

| Name | Duration | Easing | Usage |
|---|---|---|---|
| `fade-in` | 200ms | `ease-out` | Page transitions, main content |
| `slide-in` | 250ms | `ease-out` | Dropdown menus, modals |

Progress bars use `transition-all duration-500` for smooth fill animations.

---

## Component Patterns

### Cards
All data containers follow this pattern:
```
bg-surface border border-border rounded-lg shadow-card p-5
```
Hover state (interactive cards): add `hover:shadow-card-hover transition-shadow duration-200`

### Section Headers inside cards
```
<div class="px-5 py-4 border-b border-border">
  <h2 class="text-sm font-semibold text-foreground">Title</h2>
</div>
```

### Overline Labels (KPI cards)
```
<p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Label</p>
```

### Progress Bars
```html
<div class="h-1.5 bg-muted rounded-full overflow-hidden">
  <div class="h-full rounded-full transition-all duration-500 bg-brand" style="width: X%" />
</div>
```

Color mapping: green (`bg-positive`) under 80%, amber (`bg-warning`) 80–100%, red (`bg-negative`) over 100%.

### Navigation items
Active state: `text-foreground bg-accent`
Default: `text-muted-foreground hover:text-foreground hover:bg-accent`

### Input fields
```
px-3 py-2 text-sm border border-border rounded-md bg-surface text-foreground
focus:outline-none focus:ring-1 focus:ring-brand
```

---

## Chart Conventions

- **Grid lines:** horizontal only, `stroke="#F3F4F6"`, dashed `3 3`
- **Axis text:** `fontSize: 11, fill: '#9CA3AF'`
- **Axis lines:** hidden (`axisLine={false} tickLine={false}`)
- **Tooltips:** white card with `border-border`, `shadow-card-hover`, `p-3`
- **Primary chart color:** `#6366F1` (brand)
- **Income color:** `#16A34A` (positive)
- **Expense color:** `#E5E7EB` (muted border)
- **Savings color:** `#6366F1` (brand)
- **Gradient fills:** brand color with 12% opacity at top, 0% at bottom

---

## Motion Principles

1. **Purposeful, not decorative.** Animations communicate state change, not style.
2. **Fast.** Max 300ms for any UI transition. Charts animate on mount only.
3. **Easing:** `ease-out` for entrances (things arrive), `ease-in` for exits (things leave).
4. **No motion for data changes.** When numbers update, they change immediately. Only structural transitions animate.
