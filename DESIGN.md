# Airbroke Design System

## 1. Atmosphere & Identity

Airbroke is a restrained, dark-first operations workspace. Dense error data
stays readable through cool neutral surfaces, compact Geist typography, and a
single indigo interaction accent. The signature is the inset navigation shell:
deep blue-gray panels, subtle borders, and a narrow indigo gradient reserved
for active or focused controls.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Page | `--background` | `0 0% 100%` | `221 39% 11%` | Main application background |
| Text | `--foreground` | `0 0% 3.9%` | `213 27% 84%` | Default text |
| Card | `--card` | `0 0% 100%` | `221 39% 13%` | Cards and panels |
| Popover | `--popover` | `0 0% 100%` | `221 39% 13%` | Menus and overlays |
| Primary | `--primary` | `215 28% 17%` | `239 84% 67%` | Primary actions and focus |
| Secondary | `--secondary` | `0 0% 96.1%` | `230 21% 11%` | Secondary controls |
| Muted | `--muted` | `0 0% 96.1%` | `215 15% 22%` | Subdued surfaces |
| Muted text | `--muted-foreground` | `0 0% 45.1%` | `213 15% 65%` | Metadata and hints |
| Destructive text | `--destructive` | `0 84.2% 60.2%` | `0 91% 71%` | Invalid text, borders, and destructive emphasis |
| Destructive surface | `--destructive-surface` | `0 72% 42%` | `0 62.8% 30.6%` | Filled destructive actions |
| Destructive surface text | `--destructive-foreground` | `0 0% 98%` | `0 0% 98%` | Text on destructive surfaces |
| Error status | `--status-error` | `350 89% 60%` | `351 95% 71%` | Active error indicators |
| Healthy status | `--status-healthy` | `142 71% 45%` | `142 69% 58%` | Healthy project indicators |
| Paused status | `--status-paused` | `215 16% 47%` | `218 11% 65%` | Disabled or paused project indicators |
| Border | `--border` | `0 0% 89.8%` | `221 23% 20%` | Structural separation |
| Focus ring | `--ring` | `215 15% 52%` | `239 84% 67%` | Keyboard focus |
| Sidebar | `--sidebar-background` | `0 0% 98%` | `218 32% 15%` | Navigation surface |
| Sidebar accent | `--sidebar-accent` | `240 4.8% 95.9%` | `243 70% 56%` | Active navigation |

### Rules

- Use semantic Tailwind utilities backed by these tokens.
- Reserve indigo for actions, selection, focus, and state feedback.
- Keep inactive surfaces neutral; do not introduce decorative color.
- Keep destructive foreground and filled-surface roles separate so both invalid
  text and destructive buttons meet body-text contrast requirements.
- Use status roles for compact state indicators; error may pulse to signal an
  active incident, while healthy and paused states remain still.
- Extend the token set before adding a new semantic color role.

## 3. Typography

### Scale

| Level | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- |
| Page title | `1.5rem` | 600 | 1.3 | Primary page heading |
| Section title | `1.125rem` | 600 | 1.4 | Dialog and section headings |
| UI body | `1rem` | 400 | 1.5 | Forms and prose |
| Compact UI | `0.875rem` | 400-600 | 1.4 | Buttons, tables, cards |
| Metadata | `0.75rem` | 400-600 | 1.4 | Counts, captions, hints |

### Font Stack

- Primary: Geist, system sans-serif
- Mono: Geist Mono, system monospace

### Rules

- Prefer the compact product scale over display typography.
- Keep prose within 75 characters where layout permits.
- Use the mono family only for identifiers, keys, payloads, and code.

## 4. Spacing & Layout

### Base Unit

All intentional spacing follows a 4px base unit through Tailwind's standard
spacing scale.

| Token | Value | Usage |
| --- | --- | --- |
| `gap-1` | 4px | Icon and compact metadata |
| `gap-2` | 8px | Inline controls and compact rows |
| `gap-3` | 12px | Form groups and menu sections |
| `gap-4` | 16px | Default page and card rhythm |
| `gap-6` | 24px | Card internals and section groups |
| `gap-8` | 32px | Major content separation |

### Grid

- The authenticated shell owns a collapsible sidebar and a fluid content pane.
- Content reflows to one readable column at 375px.
- Cards use responsive feature-owned grids; tables may retain horizontal data
  density when their container supplies an explicit scroll owner.

## 5. Components

### Application Shell

- **Structure**: inset sidebar, top bar, breadcrumb/search/actions, content pane
- **States**: expanded, collapsed, mobile sheet, active item, focused item
- **Accessibility**: labelled navigation controls and keyboard-reachable links
- **Motion**: 200ms state transitions; no decorative entrance sequence
- **Layout**: shell; sidebar and main content own their scrolling explicitly

### Button

- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: compact text and icon sizes from the shared primitive
- **States**: default, hover, active, focus-visible, disabled, pending
- **Accessibility**: native button semantics unless deliberately rendering a link

### Card

- **Structure**: header, title, description, content, optional footer/action
- **Spacing**: 24px outer rhythm with feature-level compact overrides
- **States**: static by default; interactive treatment only when the card acts
- **Depth**: subtle border plus restrained small shadow

### Form Controls

- **Vocabulary**: input, textarea, switch, field, input group
- **States**: default, hover, focus-visible, disabled, invalid, pending
- **Accessibility**: labels remain programmatically associated; invalid state
  is exposed through `aria-invalid`

### Dialog and Alert Dialog

- **Structure**: overlay, centered popup, header, content, footer, close control
- **States**: opening, open, closing, disabled action, destructive confirmation
- **Accessibility**: every overlay has a title; focus is trapped and restored
- **Motion**: 200ms opacity and transform transitions

### Menu and Tooltip

- **Structure**: trigger, positioned popup, grouped items or descriptive content
- **States**: closed, open, highlighted, checked, disabled
- **Accessibility**: arrow-key menu navigation, Escape dismissal, labelled tooltip
- **Motion**: short opacity and transform transition tied to open state

### Empty State

- **Structure**: optional media, title, description, focused next action
- **Spacing**: compact enough to remain part of the surrounding task surface
- **Accessibility**: descriptive text precedes the action in reading order

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | 150ms | ease-out | Hover, press, focus feedback |
| Standard | 200ms | ease-in-out | Menus, dialogs, sidebar state |

- Motion communicates state only.
- Prefer opacity and transform for animated transitions.
- Respect `prefers-reduced-motion` through primitive and global styles.
- Every interactive control exposes visible hover, active, and focus states.

## 7. Depth & Surface

Airbroke uses a mixed but restrained strategy: structural borders define dense
data regions, subtle small shadows lift cards, and larger shadows are reserved
for dialogs and positioned popups. Nested decorative cards and glass effects
are outside the system.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 body contrast and 3:1 large-text contrast.
- Preserve native element semantics through Base UI `render` composition.
- Keep full keyboard reachability, visible focus, focus restoration, and Escape
  dismissal for overlays.
- Keep touch targets usable at mobile widths and avoid primary-content overflow.

### Accepted Debt

No new design or accessibility debt is accepted by the Base UI migration.
