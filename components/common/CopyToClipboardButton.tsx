"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  label?: string; // optional; when omitted and size is icon*, show icon-only
  size?: "sm" | "lg" | "default" | "icon" | "icon-sm" | "icon-lg";
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
};

export default function CopyToClipboardButton({
  value,
  label,
  size = "sm",
  variant = "secondary",
}: Props) {
  const isIconOnly = (size as string).startsWith("icon");
  const showLabel = !!label && !isIconOnly;
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      aria-label={label ?? "Copy"}
      onClick={() => {
        try {
          navigator.clipboard.writeText(value);
        } catch {
          // noop
        }
      }}
    >
      <Copy />
      {showLabel ? <span className="ml-1">{label}</span> : null}
    </Button>
  );
}
