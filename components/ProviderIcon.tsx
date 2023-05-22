import { IconType } from 'react-icons';
import { FaBitbucket, FaGitAlt, FaGithub } from 'react-icons/fa';

export const providerIcons: { [key: string]: IconType } = {
  github: FaGithub,
  bitbucket: FaBitbucket,
  gitlab: FaGitAlt,
};

interface ProviderIconProps {
  provider: string;
  className?: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, className }) => {
  const Icon = providerIcons.hasOwnProperty(provider.toLowerCase()) ? providerIcons[provider.toLowerCase()] : FaGitAlt;

  return <Icon className={className} aria-hidden="true" />;
};
