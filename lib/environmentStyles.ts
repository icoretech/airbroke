// lib/environmentStyles.ts

// 1) A base mapping for each environment key, splitting text vs. background/ring
const environmentMapping: Record<
  string,
  {
    text: string;
    background: string; // includes background color + ring color
  }
> = {
  default: {
    text: 'text-white',
    background: 'bg-gray-900 ring-gray-700',
  },
  prod: {
    text: 'text-indigo-400',
    background: 'bg-indigo-400/10 ring-indigo-400/30',
  },
  staging: {
    text: 'text-gray-400',
    background: 'bg-gray-400/10 ring-gray-400/20',
  },
  test: {
    text: 'text-white',
    background: 'bg-rose-900 ring-rose-700',
  },
  dev: {
    text: 'text-green-400',
    background: 'bg-green-400/10 ring-green-400/20',
  },
  qa: {
    text: 'text-purple-400',
    background: 'bg-purple-400/10 ring-purple-400/20',
  },
  uat: {
    text: 'text-yellow-400',
    background: 'bg-yellow-400/10 ring-yellow-400/20',
  },
  sandbox: {
    text: 'text-pink-400',
    background: 'bg-pink-400/10 ring-pink-400/20',
  },
};

/**
 * Internal helper to figure out which key applies
 * based on your substring logic (e.g. if env includes 'prod', use 'prod').
 */
function getEnvironmentKey(env: string): string {
  const lowerEnv = env.toLowerCase();
  // If 'prod', 'staging', 'test', etc. is found in `env`, pick that key;
  // else 'default'
  const matchedKey =
    Object.keys(environmentMapping).find((key) => key !== 'default' && lowerEnv.includes(key)) || 'default';

  return matchedKey;
}

/**
 * Returns only the **text color** classes for the given env.
 * e.g. "text-indigo-400"
 */
export function getEnvironmentTextColor(env: string): string {
  const envKey = getEnvironmentKey(env);
  return environmentMapping[envKey].text;
}

/**
 * Returns only the **background + ring** classes for the given env.
 * e.g. "bg-gray-400/10 ring-gray-400/20"
 */
export function getEnvironmentBackground(env: string): string {
  const envKey = getEnvironmentKey(env);
  return environmentMapping[envKey].background;
}

/**
 * Returns the **full** set of classes combining text + background + ring
 * (the original style from <EnvironmentLabel>).
 */
export function getEnvironmentClasses(env: string): string {
  const envKey = getEnvironmentKey(env);
  const { text, background } = environmentMapping[envKey];
  return `${text} ${background}`;
}
