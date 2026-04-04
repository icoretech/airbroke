# Resolve Management Rework

## Problem

The current resolve system is minimal: `resolved_at` exists only on occurrences,
there are no bulk operations, no UI filtering by resolved state, and no
notice-level resolution. This makes it impossible to keep the notices list clean
without resorting to deleting data. The result is that resolved errors stay
visible alongside active ones, creating noise and reducing the tool's
usefulness for triage.

## Approach

Denormalized `resolved_at` on Notice, synchronized by a PostgreSQL trigger.
No application-level sync logic.

## Schema Changes

### Notice model

Add to `Notice`:

```prisma
resolved_at DateTime? @db.Timestamp(6)
```

Add a database index on `notices.resolved_at` for filtered query performance.

### PostgreSQL trigger

Create function `sync_notice_resolved_at()` and attach as:

```
AFTER INSERT OR UPDATE OF resolved_at OR DELETE ON occurrences
FOR EACH ROW
```

Logic:

1. Determine the affected `notice_id` (use `NEW.notice_id` for INSERT/UPDATE,
   `OLD.notice_id` for DELETE).
2. Count occurrences for that notice where `resolved_at IS NULL`.
3. If count = 0 (all resolved or no occurrences remain):
   `UPDATE notices SET resolved_at = NOW() WHERE id = notice_id AND resolved_at IS NULL`
4. If count > 0 (at least one unresolved):
   `UPDATE notices SET resolved_at = NULL WHERE id = notice_id AND resolved_at IS NOT NULL`

The conditional guards (`AND resolved_at IS [NOT] NULL`) avoid unnecessary
writes and `updated_at` churn.

### Migration backfill

After creating the column and trigger, run a one-time backfill:

```sql
UPDATE notices SET resolved_at = NOW()
WHERE id IN (
  SELECT n.id FROM notices n
  WHERE EXISTS (SELECT 1 FROM occurrences o WHERE o.notice_id = n.id)
  AND NOT EXISTS (
    SELECT 1 FROM occurrences o
    WHERE o.notice_id = n.id AND o.resolved_at IS NULL
  )
);
```

This sets `resolved_at` for any notice whose existing occurrences are all
already resolved.

### processError impact

No changes needed. The existing `resolved_at: null` in the occurrence upsert
update clause handles auto-reinstate. The trigger propagates that to the notice
automatically.

## Server Actions

### Existing (unchanged)

- `resolveOccurrence(occurrenceId)` -- sets `resolved_at = NOW()` on one
  occurrence. Trigger syncs notice.
- `reinstateOccurrence(occurrenceId)` -- clears `resolved_at` on one
  occurrence. Trigger syncs notice.

### New actions (`lib/actions/noticeActions.ts`)

- **`resolveAllOccurrences(noticeId)`** -- resolves all unresolved occurrences
  under a notice:
  `UPDATE occurrences SET resolved_at = NOW() WHERE notice_id = ? AND resolved_at IS NULL`

- **`reinstateAllOccurrences(noticeId)`** -- reinstates all resolved occurrences
  under a notice:
  `UPDATE occurrences SET resolved_at = NULL WHERE notice_id = ? AND resolved_at IS NOT NULL`

- **`resolveSelectedNotices(noticeIds: string[])`** -- resolves all occurrences
  under the given notices:
  `WHERE notice_id IN (?) AND resolved_at IS NULL`

- **`resolveAllByProjectEnv(projectId, env?)`** -- resolves all occurrences
  under notices matching project and optionally environment. The nuclear option.

All actions are auth-gated and revalidate relevant paths. None of them write
`notices.resolved_at` directly -- that is 100% trigger territory.

### Revalidation & caching

Next.js 16 caching is tricky after mutations. Key considerations:

- Each bulk action must `revalidatePath()` for all affected routes. For
  notice-scoped actions: `/projects/[project_id]` and `/notices/[notice_id]`.
  For project/env-scoped actions: `/projects/[project_id]` plus all affected
  notice pages.
- Bulk actions that affect many notices should use `revalidatePath` on the
  project page and consider `revalidateTag` if we tag notice queries.
- After a mutation, the server action should NOT redirect -- let the client
  component handle UI updates via `useTransition` / `startTransition` so the
  page re-renders with fresh server data.
- The `StatusFilter` is link-based (search params), so switching between
  Unresolved/Resolved/All is a navigation, not a mutation -- no revalidation
  needed.
- The bulk action toolbar components use client-side state for checkbox
  selection. After a resolve action completes, clear the selection state and
  rely on the revalidated server component re-render to update the list.
- For `router.refresh()` after bulk actions: evaluate whether `revalidatePath`
  alone is sufficient or if the client component needs an explicit refresh call.
  Test empirically with the running stack.

## Query Layer

### `lib/queries/notices.ts`

Add `resolvedFilter?: 'unresolved' | 'resolved' | 'all'` to
`NoticeSearchParams`. Default: `'unresolved'`.

Where-clause mapping:

- `'unresolved'` -> `{ resolved_at: null }`
- `'resolved'` -> `{ resolved_at: { not: null } }`
- `'all'` -> no filter

### `lib/queries/occurrences.ts`

Add `resolvedFilter?: 'unresolved' | 'resolved' | 'all'` to
`OccurrenceSearchParams`. Default: `'all'` (when scoped to a single notice,
show everything).

Same where-clause mapping.

## MCP API

### `airbroke_list_notices`

Add `include_resolved` boolean parameter (default: `true`). When `false`,
filter `{ resolved_at: null }`. Same pattern as existing occurrence MCP tools.

### `airbroke_get_notice`

Include `resolved_at` in the response payload.

### `airbroke_list_occurrences`, `airbroke_get_occurrence`, `airbroke_search`

Already have `include_resolved` for occurrence filtering. Ensure
`notice.resolved_at` is included in response payloads where notice data is
returned.

## UI Changes

### Notices list (`/projects/[project_id]`)

**Status filter:** New `StatusFilter` component alongside existing
`EnvironmentFilter`. Dropdown with three options: Unresolved (default) /
Resolved / All. Uses `?status=unresolved|resolved|all` search param.
Link-based navigation, same pattern as the environment filter.

**Bulk actions:** Checkboxes on each notice row. Header row with select-all
checkbox. When selection is active, a toolbar appears with:

- "Resolve selected" button
- Count indicator ("3 selected")

**Per-notice resolve button:** Inline button on each notice row. "Resolve all"
when unresolved (resolves all occurrences under it). "Reinstate" when resolved
(visible in Resolved/All views).

**Resolve all for environment:** When an environment filter is active, show a
"Resolve all [env]" button in the bulk actions toolbar area (not inside the
environment dropdown, since the dropdown is for filtering, not actions). This
button is always visible when an env filter is active, independent of checkbox
selection.

**Resolved badge:** Notices in Resolved/All views show a "Resolved" badge with
relative timestamp.

### Occurrences list (`/notices/[notice_id]`)

**Status filter:** Same `StatusFilter` component, defaults to All.

**Bulk actions:** Same checkbox + toolbar pattern. "Resolve selected" /
"Reinstate selected".

**Per-occurrence resolve button:** Already exists, no changes.

### Occurrence detail (`/occurrences/[occurrence_id]`)

No changes. Existing `ResolveButton` works as-is. Trigger handles notice sync.

### NoticesTable row changes

- Add checkbox column (left side)
- Add per-notice resolve/reinstate button (right side)
- Show "Resolved" badge when `resolved_at` is set

## Data Integrity & Edge Cases

**New occurrence on resolved notice:** `processError` upserts with
`resolved_at: null`. Trigger fires, finds unresolved occurrence, clears
`notices.resolved_at`. Notice reappears in default view. Correct.

**Occurrence deletion:** Trigger fires on `DELETE`. If the deleted occurrence
was the last unresolved one, remaining resolved siblings cause the notice to
become resolved. If the notice has no occurrences left, cascade delete from
notice handles it (notice is gone).

**Concurrent resolution:** Two users resolve the last two unresolved
occurrences simultaneously. PostgreSQL row-level locking on the notice row
ensures only one writer wins. The conditional `AND resolved_at IS [NOT] NULL`
guard makes the other a no-op. Safe.

**Bulk update (many rows):** Trigger fires per-row. First N-1 executions find
remaining unresolved siblings and skip. Last one resolves the notice. Correct.
Per-row cost is acceptable given typical occurrences-per-notice cardinality.

## Testing

- Server action tests for all new bulk resolve/reinstate operations
- `processError` test confirming auto-reinstate propagates to notice
  (occurrence resolved -> new event -> occurrence reinstated -> notice
  reinstated)
- Query tests verifying the three-state filter works correctly
- MCP tool tests for `include_resolved` on notices
- Trigger behavior: resolve all occurrences -> notice resolved; reinstate one
  -> notice reinstated; delete last unresolved -> notice resolved
