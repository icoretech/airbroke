// __tests__/pages/signinPageClient.test.tsx

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
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
  beforeEach(() => {
    signInSocialMock.mockReset();
  });

  afterEach(cleanup);

  test("explains unavailable sign-in when no providers are configured", () => {
    render(
      <SignInPageClient
        providers={[]}
        callbackUrl="/projects"
        showError={false}
      />,
    );

    screen.getByText("Sign-in is unavailable");
    screen.getByText(/contact your administrator to enable access/i);
    expect(screen.queryByText(/choose a provider/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /sign in with/i })).toBeNull();
    expect(
      screen
        .getByRole("link", { name: /go to homepage/i })
        .getAttribute("href"),
    ).toBe("/");
    expect(signInSocialMock).not.toHaveBeenCalled();
  });

  test("announces an authentication failure while keeping configured providers available", () => {
    render(
      <SignInPageClient
        providers={[{ id: "github", name: "GitHub", type: "social" }]}
        callbackUrl="/projects"
        showError
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("Sign-in failed");
    expect(
      screen
        .getByRole("button", { name: /sign in with github/i })
        .hasAttribute("disabled"),
    ).toBe(false);
  });

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
