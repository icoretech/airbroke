import classNames from '@/lib/classNames';

export default function EnvironmentLabel({ env }: { env: string }) {
  const environments = {
    default: 'text-white bg-gray-900 ring-gray-700',
    production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    staging: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    test: 'text-white bg-rose-900 ring-rose-700',
  };

  return (
    <div
      className={classNames(
        env === 'production'
          ? environments.production
          : env === 'staging'
          ? environments.staging
          : environments.default,
        'flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
      )}
    >
      {env}
    </div>
  );
}
