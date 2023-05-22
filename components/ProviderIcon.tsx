import { IconType } from 'react-icons';
import { FaBitbucket, FaCode, FaGithub, FaGitlab } from 'react-icons/fa';

export const providerIcons: { [key: string]: IconType } = {
  github: FaGithub,
  bitbucket: FaBitbucket,
  gitlab: FaGitlab,
};

interface ProviderIconProps {
  provider: string;
  className?: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, className }) => {
  const Icon = providerIcons.hasOwnProperty(provider.toLowerCase()) ? providerIcons[provider.toLowerCase()] : FaCode;

  return <Icon className={className} aria-hidden="true" />;
};
