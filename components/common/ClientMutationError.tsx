import { cn } from "@/lib/utils";

export default function ClientMutationError({
  className,
  message,
}: {
  className?: string;
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className={cn("text-xs text-red-300", className)} role="alert">
      {message}
    </p>
  );
}
