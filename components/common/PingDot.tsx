// components/PingDot.tsx

import clsx from "clsx";

/**
 * Union type of allowed color keys.
 * If you add more color keys, just add them here.
 */
type PingDotColor = "red" | "green" | "gray";

/**
 * Map each color key to its Tailwind fill class.
 * By using `as const`, we ensure `fillClasses[color]` is properly typed.
 */
const fillClasses = {
  red: "fill-rose-400",
  green: "fill-green-400",
  gray: "fill-gray-400",
} as const;

interface PingDotProps {
  /** Which color variant to display */
  color: PingDotColor;
}

/**
 * Renders a small pulsating dot using two nested <svg> elements.
 */
export default function PingDot({ color }: PingDotProps) {
  return (
    <span className="relative flex h-2 w-2">
      <svg
        viewBox="0 0 6 6"
        aria-hidden="true"
        className={clsx(
          "absolute h-full w-full",
          fillClasses[color],
          "animate-ping",
        )}
      >
        <circle r={3} cx={3} cy={3} />
      </svg>
      <svg
        viewBox="0 0 6 6"
        aria-hidden="true"
        className={clsx("relative h-full w-full", fillClasses[color])}
      >
        <circle r={3} cx={3} cy={3} />
      </svg>
    </span>
  );
}
