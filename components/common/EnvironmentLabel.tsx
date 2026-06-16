// components/EnvironmentLabel.tsx

import clsx from "clsx";
import { getEnvironmentClasses } from "@/lib/environmentStyles";

export default function EnvironmentLabel({
  env,
  className,
}: {
  env: string;
  className?: string;
}) {
  // Get the base environment style
  const environmentStyle = getEnvironmentClasses(env);

  return (
    <div
      className={clsx(
        environmentStyle,
        // Then apply your extra styling for the “label” look:
        "flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        className,
      )}
    >
      {env}
    </div>
  );
}
