import { Project } from "@prisma/client";

export function composeRepoUrl(project: Project): string {
  let baseUrl: string;

  switch (project.repo_provider) {
    case 'github':
      baseUrl = 'https://github.com';
      break;
    case 'bitbucket':
      baseUrl = 'https://bitbucket.org';
      break;
    default:
      return '#';
  }

  return `${baseUrl}/${project.organization}/${project.name}`;
}

export function composeFileUrl(
  project: Project,
  filePath: string,
  lineNumber?: number
): string {
  const repoFullUrl = composeRepoUrl(project);
  if (repoFullUrl === '#') {
    return '#';
  }

  const url = `${repoFullUrl}/blob/${project.repo_branch}/${filePath}`;

  if (lineNumber) {
    return `${url}#L${lineNumber}`;
  }

  return url;
}
