# React Icons Cognito Icon Fix Design

## Context
The Renovate bump to `react-icons@5.6.0` removed the `SiAmazoncognito` export used by the sign-in page. This breaks the Next.js build and blocks CI.

## Goals
- Keep using `react-icons`.
- Restore a valid icon for Cognito providers.
- Add a regression test to catch missing icon exports and verify sign-in wiring.

## Non-Goals
- Changing provider identifiers or authentication flow.
- Introducing custom SVGs or another icon library.

## Proposed Approach
- Replace `SiAmazoncognito` with `FaAws` from `react-icons/fa` in `app/signin/SignInPageClient.tsx`.
- Add a Vitest test that renders the sign-in page with a Cognito provider, asserts the icon renders, and confirms the `signIn` call is triggered when the button is clicked.

## Testing Plan
- Run `docker compose exec test yarn test __tests__/pages/signinPageClient.test.tsx` in the test container.

## Rollout
- Land the icon swap + test in the same PR as the dependency bump.
- CI should pass; no runtime migrations are needed.
