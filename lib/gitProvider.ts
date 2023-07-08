import { Project } from '@prisma/client';

export function composeFileUrl(project: Project, filePath: string, lineNumber?: number): string {
  const repoUrl = project.repo_url?.toLowerCase() || '';
  const repoBranch = project.repo_branch?.toLowerCase() || '';
  const filePathLower = filePath.toLowerCase();
  if (!repoUrl || !repoBranch || !filePathLower) {
    return '';
  }

  let url: string;

  switch (project.repo_provider?.toLowerCase()) {
    case 'github':
      url = `${repoUrl}/blob/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    case 'bitbucket':
      url = `${repoUrl}/src/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#lines-${lineNumber}`;
      }
      break;
    case 'gitlab':
      url = `${repoUrl}/-/blob/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    case 'gitkraken':
      url = `${repoUrl}/tree/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    case 'gitea':
      url = `${repoUrl}/src/branch/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    case 'gogs':
      url = `${repoUrl}/blob/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    case 'gitter':
      url = `${repoUrl}/blob/${repoBranch}/${filePathLower}`;
      if (lineNumber) {
        url += `#L${lineNumber}`;
      }
      break;
    default:
      url = '';
      break;
  }

  return url;
}
