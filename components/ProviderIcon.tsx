import type { IconType } from 'react-icons-ng';
import { FaBitbucket, FaCode, FaGithub, FaGitkraken, FaGitlab, FaGitter } from 'react-icons-ng/fa';
import { SiGitea } from 'react-icons-ng/si';

// Mapping of provider names to their respective icons.
export const providerIcons: Record<string, IconType> = {
  github: FaGithub,
  bitbucket: FaBitbucket,
  gitlab: FaGitlab,
  gitkraken: FaGitkraken,
  gitea: SiGitea,
  gogs: FaCode, // Using a generic code icon for Gogs as a specific one might not be available.
  gitter: FaGitter,
};

interface ProviderIconProps {
  provider: string; // Name of the provider (e.g., "github", "gitlab").
  className?: string; // Optional CSS class to style the icon.
}

// Component to display the icon associated with a specific provider.
export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider: rawProvider, className }) => {
  const provider = rawProvider.toLowerCase();
  const Icon = providerIcons[provider] || FaCode;

  return <Icon className={className} aria-hidden="true" />;
};
