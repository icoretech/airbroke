// components/PageBackground.tsx
import Background from "@/components/Background";

export default function PageBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate w-full bg-linear-to-b from-airbroke-900/40 to-background">
      <Background />
      {children}
    </div>
  );
}
