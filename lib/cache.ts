import { unstable_cache } from 'next/cache';
import { parse, stringify } from 'superjson';

export async function customCache<T>(
  fn: (...args: any[]) => Promise<T>,
  keyParts: any[] = [],
  options: any = {}
): Promise<T> {
  if (process.env.AIRBROKE_CACHE === 'true') {
    const cacheKey = [...keyParts, JSON.stringify(options)].join('-');

    // const stackTrace = new Error().stack;
    // const callerFunctionName = stackTrace?.split('\n')[2].trim();
    // console.log(`Cache key: ${cacheKey} @ ${callerFunctionName}`);

    const cachedFn = unstable_cache(
      async (...args: any[]) => {
        const result = await fn(...args);
        // Serialize data using SuperJSON before caching
        const serializedResult = stringify(result);
        return serializedResult;
      },
      [cacheKey],
      options
    );

    const cachedResult = await cachedFn();

    // Deserialize data using SuperJSON after retrieving from cache
    const deserializedResult = parse(cachedResult);
    return deserializedResult as T;
  }

  // If caching is not enabled, just call the function
  return await fn();
}
