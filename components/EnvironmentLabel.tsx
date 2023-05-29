import classNames from '@/lib/classNames';

const environments: { [key: string]: string } = {
  default: 'text-white bg-gray-900 ring-gray-700',
  production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
  staging: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  test: 'text-white bg-rose-900 ring-rose-700',
};

export default function EnvironmentLabel({ env, className }: { env: string; className?: string }) {
  const environmentStyle = environments[env] || environments.default;

  return (
    <div
      className={classNames(
        environmentStyle,
        'flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        className
      )}
    >
      {env}
    </div>
  );
}
