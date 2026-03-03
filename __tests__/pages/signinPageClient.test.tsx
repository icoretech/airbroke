// __tests__/pages/signinPageClient.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

const signInMock = vi.hoisted(() => vi.fn());

const makeIcon = vi.hoisted(
  () => (dataIcon: string) => (props: Record<string, unknown>) => (
    <svg data-icon={dataIcon} {...props} />
  ),
);

vi.mock("react-icons/fa", () => ({
  FaApple: makeIcon("fa-apple"),
  FaBitbucket: makeIcon("fa-bitbucket"),
  FaGithub: makeIcon("fa-github"),
  FaGitlab: makeIcon("fa-gitlab"),
  FaGoogle: makeIcon("fa-google"),
  FaSlack: makeIcon("fa-slack"),
  FaAws: makeIcon("fa-aws"),
}));

vi.mock("react-icons/si", () => ({
  SiAmazoncognito: makeIcon("si-amazoncognito"),
  SiAuthentik: makeIcon("si-authentik"),
  SiKeycloak: makeIcon("si-keycloak"),
  SiOkta: makeIcon("si-okta"),
}));

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
    expect(cognitoIcon?.getAttribute("data-icon")).toBe("fa-aws");
    fireEvent.click(cognitoButton);
    expect(signInMock).toHaveBeenCalledWith("cognito", {
      callbackUrl: "/projects",
    });
  });
});
