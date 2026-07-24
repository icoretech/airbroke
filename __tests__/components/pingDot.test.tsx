import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import PingDot from "@/components/common/PingDot";

describe("PingDot", () => {
  test("animates the error state while honoring reduced-motion preferences", () => {
    const { container } = render(<PingDot color="red" />);
    const animatedDot = container.querySelector(".animate-ping");

    expect(animatedDot?.classList.contains("fill-status-error")).toBe(true);
    expect(animatedDot?.classList.contains("fill-rose-400")).toBe(false);
    expect(animatedDot?.classList.contains("motion-reduce:animate-none")).toBe(
      true,
    );
  });

  test.each([
    ["green", "fill-status-healthy"],
    ["gray", "fill-status-paused"],
  ] as const)("keeps the %s state still", (color, fillClass) => {
    const { container } = render(<PingDot color={color} />);
    const staticDot = container.querySelector("svg");

    expect(container.querySelector(".animate-ping")).toBeNull();
    expect(staticDot?.classList.contains(fillClass)).toBe(true);
    expect(staticDot?.className.baseVal).not.toMatch(/fill-(green|gray)-400/);
  });
});
