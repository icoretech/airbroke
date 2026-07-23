# UI PRIMITIVE GUIDE

## OVERVIEW

This directory is registry-managed shadcn/Radix source, not ordinary feature
UI. The updater can overwrite every component in one pass.

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Registry contract | `../../components.json` | New York style, RSC, Lucide |
| Updater | `../../bin/update-shadcn-components.mjs` | Uses `--overwrite` |
| Dry run | `package.json` | `shadcn:update:dry` |
| Consumers | `../*/` and `../../app/` | Verify changed primitives in context |

## CONVENTIONS

- Preserve the upstream component API, `data-slot` attributes, variants, and
  Radix composition unless a deliberate local customization requires change.
- Use `yarn shadcn:update:dry` to inspect registry updates before applying
  `yarn shadcn:update`; run both inside the `web` container.
- Keep primitives domain-neutral. Feature behavior belongs in sibling domain
  directories, not here.
- Preserve registry output style. This directory is excluded from TypeScript
  project checking and from Biome formatting/linting by design.

## ANTI-PATTERNS

- Do not mass-format or auto-organize this directory.
- Do not hand-edit a generated discrepancy that should be fixed by regenerating
  from the registry and then applying an intentional customization.
- Do not add database access, authentication, server actions, or product copy
  to primitives.
- Do not claim automated checks cover a primitive change; manually exercise
  representative consuming screens and interactions.
