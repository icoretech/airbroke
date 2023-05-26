import { composeFileUrl } from '@/lib/gitProvider';
import { Project } from '@prisma/client';

export default function LinkedBacktraceLine({ file, line, project }: { file: string; line: number; project: Project }) {
  if (file.includes('PROJECT_ROOT')) {
    const filePath = file.replace('/PROJECT_ROOT/', '');
    const fileUrl = composeFileUrl(project, filePath, line);

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-200">
        {file}
      </a>
    );
  } else {
    return <>{file}</>;
  }
}
