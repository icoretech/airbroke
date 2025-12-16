// components/PageBackground.tsx
import Background from "@/components/Background";

export default function PageBackground({
  children,
  fullHeight = true,
}: {
  children: React.ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <div
      className={`relative isolate w-full overflow-hidden bg-linear-to-b from-airbroke-900/40 to-background${fullHeight ? " min-h-screen" : ""}`}
    >
      <Background />
      {children}
    </div>
  );
}
