// __tests__/pages/signinPageClient.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

const signInMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/components/FooterCredits", () => ({
  default: () => <div data-testid="footer-credits" />,
}));

import SignInPageClient from "../../app/signin/SignInPageClient";

describe("SignInPageClient", () => {
  test("renders provider buttons", () => {
    render(
      <SignInPageClient
        providers={[
          { id: "github", name: "GitHub" },
          { id: "cognito", name: "Cognito" },
        ]}
      />,
    );

    screen.getByRole("heading", { name: /sign in to airbroke/i });
    screen.getByRole("button", { name: /sign in with github/i });
    const cognitoButton = screen.getByRole("button", {
      name: /sign in with cognito/i,
    });
    const cognitoIcon = cognitoButton.querySelector("svg");
    expect(cognitoIcon).not.toBeNull();
    fireEvent.click(cognitoButton);
    expect(signInMock).toHaveBeenCalledWith("cognito", {
      callbackUrl: "/projects",
    });
  });
});
