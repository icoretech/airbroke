// __tests__/pages/signinPageClient.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { ReactNode } from "react";

const signInSocialMock = vi.hoisted(() => vi.fn());
const signInOAuth2Mock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: signInSocialMock,
      oauth2: signInOAuth2Mock,
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

vi.mock("@/components/FooterCredits", () => ({
  default: () => <span data-testid="footer-credits" />,
}));

import SignInPageClient from "../../app/signin/SignInPageClient";

describe("SignInPageClient", () => {
  test("renders provider buttons and calls correct sign-in method", () => {
    render(
      <SignInPageClient
        providers={[
          { id: "github", name: "GitHub", type: "social" as const },
          { id: "cognito", name: "Cognito", type: "oauth2" as const },
        ]}
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

    // Verify oauth2 provider renders with icon
    const cognitoButton = screen.getByRole("button", {
      name: /sign in with cognito/i,
    });
    const cognitoIcon = cognitoButton.querySelector("svg");
    expect(cognitoIcon).not.toBeNull();
  });
});
