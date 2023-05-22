import { IconType } from 'react-icons';
import { FaBitbucket, FaCode, FaGithub, FaGitkraken, FaGitlab, FaGitter } from 'react-icons/fa';
import { SiGitea } from 'react-icons/si';

export const providerIcons: { [key: string]: IconType } = {
  github: FaGithub,
  bitbucket: FaBitbucket,
  gitlab: FaGitlab,
  gitkraken: FaGitkraken,
  gitea: SiGitea,
  gogs: FaCode,
  gitter: FaGitter,
};

interface ProviderIconProps {
  provider: string;
  className?: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, className }) => {
  const Icon = providerIcons.hasOwnProperty(provider.toLowerCase()) ? providerIcons[provider.toLowerCase()] : FaCode;

  return <Icon className={className} aria-hidden="true" />;
};
