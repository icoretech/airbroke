import { SlDisc } from "react-icons/sl";

export default function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground"
    >
      <SlDisc aria-hidden="true" className="size-5 animate-spin" />
      <span>Loading bookmarks...</span>
    </div>
  );
}
