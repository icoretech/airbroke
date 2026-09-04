// __tests__/pages/signinPageClient.test.tsx

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { ReactNode } from "react";

const signInSocialMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/client", () => ({
  authClient: {
    signIn: {
      social: signInSocialMock,
    },
  },
}));

vi.mock("next/image", () => ({
  default: () => <span data-testid="next-image" />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/components/layout/FooterCredits", () => ({
  default: () => <span data-testid="footer-credits" />,
}));

import SignInPageClient from "../../app/signin/SignInPageClient";

describe("SignInPageClient", () => {
  test("renders provider buttons and signs in with built-in and generic providers", () => {
    render(
      <SignInPageClient
        providers={[
          { id: "github", name: "GitHub", type: "social" as const },
          { id: "cognito", name: "Cognito", type: "oauth2" as const },
        ]}
        callbackUrl="/projects"
        showError={false}
      />,
    );

    screen.getByRole("heading", { name: /sign in to airbroke/i });
    screen.getByRole("button", { name: /sign in with github/i });

    // Click a social provider
    const githubButton = screen.getByRole("button", {
      name: /sign in with github/i,
    });
    fireEvent.click(githubButton);
    expect(signInSocialMock).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/projects",
    });

    // A successful sign-in disables the remaining controls while navigation
    // begins, so render again to exercise the generic-provider path.
    cleanup();
    render(
      <SignInPageClient
        providers={[
          { id: "github", name: "GitHub", type: "social" as const },
          { id: "cognito", name: "Cognito", type: "oauth2" as const },
        ]}
        callbackUrl="/projects"
        showError={false}
      />,
    );
    // Generic OAuth providers also use Better Auth's standard social API.
    const cognitoButton = screen.getByRole("button", {
      name: /sign in with cognito/i,
    });
    fireEvent.click(cognitoButton);
    expect(signInSocialMock).toHaveBeenCalledWith({
      provider: "cognito",
      callbackURL: "/projects",
    });
  });
});
