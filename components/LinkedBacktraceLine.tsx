import { composeFileUrl } from '@/lib/gitProvider';
import { project } from '@prisma/client';
import Link from 'next/link';

export default function LinkedBacktraceLine({ file, line, project }: { file: string; line: number; project: project }) {
  if (file.includes('PROJECT_ROOT')) {
    const filePath = file.replace('/PROJECT_ROOT/', '');
    const fileUrl = composeFileUrl(project, filePath, line);

    return (
      <Link href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-200">
        {file}
      </Link>
    );
  } else {
    return <>{file}</>;
  }
}
