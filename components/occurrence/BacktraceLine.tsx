// components/occurrence/BacktraceLine.tsx

import { composeFileUrl } from "@/lib/gitProvider";
import type { Project } from "@/prisma/generated/client";

export default function LinkedBacktraceLine({
  file,
  line,
  project,
}: {
  file: string;
  line: number;
  project: Project;
}) {
  if (file.includes("PROJECT_ROOT")) {
    const filePath = file.replace("/PROJECT_ROOT/", "");
    const fileUrl = composeFileUrl(project, filePath, line);

    return fileUrl ? (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80"
      >
        {file}
      </a>
    ) : (
      <span className="text-primary">{file}</span>
    );
  } else {
    return <>{file}</>;
  }
}
