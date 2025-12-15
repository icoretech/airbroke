// components/SourceRepoProviderIcon.tsx

import {
  FaBitbucket,
  FaCode,
  FaGithub,
  FaGitkraken,
  FaGitlab,
  FaGitter,
} from "react-icons/fa";
import { SiGitea } from "react-icons/si";
import type { IconType } from "react-icons";

type KnownSourceRepoProviders =
  | "github"
  | "bitbucket"
  | "gitlab"
  | "gitkraken"
  | "gitea"
  | "gogs"
  | "gitter"
  | string;
type SourceRepoProviderIconProps = {
  /** Name of the provider (e.g., "github", "gitlab"). */
  sourceRepoProvider: KnownSourceRepoProviders;
  /** Optional CSS classes to style the icon. */
  className?: string;
};

const providerIcon: Record<string, IconType> = {
  github: FaGithub,
  bitbucket: FaBitbucket,
  gitlab: FaGitlab,
  gitkraken: FaGitkraken,
  gitea: SiGitea,
  gogs: FaCode,
  gitter: FaGitter,
};

/**
 * Displays an icon for a given git provider, falling back to a generic code icon if not recognized.
 */
export function SourceRepoProviderIcon({
  sourceRepoProvider,
  className,
}: SourceRepoProviderIconProps) {
  const iconKey = sourceRepoProvider.toLowerCase();
  const Icon = providerIcon[iconKey] ?? FaCode;
  return <Icon className={className} aria-hidden="true" />;
}
