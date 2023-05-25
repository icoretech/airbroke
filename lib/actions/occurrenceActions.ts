'use server';

import { Context } from '@/types/airbroke';

export async function performReplay(context: Context): Promise<string> {
  const { headers, httpMethod, url } = context;
  if (!url) return 'This does not look like a valid HTTP request to replay, url property is missing.';

  const requestOptions: RequestInit = {
    method: httpMethod,
    headers: headers,
    cache: 'no-store'
  };

  let responseText = 'Fetching...';
  try {
    const response = await fetch(url, requestOptions);

    const responseBody = await response.text();
    if (response.ok) {
      responseText = `HTTP Status Code: ${response.status}\nBody hidden`;
    } else {
      responseText = `HTTP Status Code: ${response.status}\n${responseBody}`;
    }
  } catch (error) {
    responseText = `Error occurred during fetch: ${error}`;
  }

  return responseText;
}
