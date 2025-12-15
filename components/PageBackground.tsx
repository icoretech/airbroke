// components/PageBackground.tsx
import Background from "@/components/Background";

export default function PageBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-linear-to-b from-airbroke-900/40 to-background">
      <Background />
      {children}
    </div>
  );
}
