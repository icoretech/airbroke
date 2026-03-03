# React Icons Cognito Icon Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the removed Cognito icon export with a stable react-icons alternative and add a regression test.

**Architecture:** Keep using react-icons. Swap the Cognito icon to `FaAws` from FontAwesome and add a focused Vitest test that renders the sign-in page and verifies the Cognito button triggers `signIn` and renders the icon.

**Tech Stack:** Next.js 16, React, react-icons, Vitest, Testing Library.

---

### Task 1: Add a failing regression test for Cognito sign-in

**Files:**
- Create: `__tests__/pages/signinPageClient.test.tsx`

**Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignInPageClient from "@/app/signin/SignInPageClient";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

const signInMock = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...props} />
  ),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SignInPageClient", () => {
  it("triggers signIn for cognito providers and shows icon", () => {
    render(
      <SignInPageClient
        providers={[{ id: "cognito", name: "AWS Cognito" }]}
      />
    );

    const button = screen.getByRole("button", {
      name: "Sign in with AWS Cognito",
    });

    fireEvent.click(button);

    expect(signInMock).toHaveBeenCalledWith("cognito", {
      callbackUrl: "/projects",
    });
    expect(button.querySelector("svg")).not.toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `docker compose exec test yarn test __tests__/pages/signinPageClient.test.tsx`

Expected: FAIL due to missing Cognito icon export from `react-icons/si`.

### Task 2: Replace the Cognito icon with FaAws

**Files:**
- Modify: `app/signin/SignInPageClient.tsx`

**Step 1: Write minimal implementation**

```tsx
import {
  FaApple,
  FaBitbucket,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaSlack,
  FaAws,
} from "react-icons/fa";

import { SiAuthentik, SiKeycloak, SiOkta } from "react-icons/si";

const providerIcons: Record<string, React.ElementType> = {
  // ...
  cognito: FaAws,
};
```

**Step 2: Run test to verify it passes**

Run: `docker compose exec test yarn test __tests__/pages/signinPageClient.test.tsx`

Expected: PASS.

### Task 3: Commit

**Files:**
- Modify: `app/signin/SignInPageClient.tsx`
- Create: `__tests__/pages/signinPageClient.test.tsx`

**Step 1: Commit**

```bash
git add app/signin/SignInPageClient.tsx __tests__/pages/signinPageClient.test.tsx
git commit -m "fix(signin): replace cognito icon with FaAws"
```
