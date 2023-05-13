import { timingSafeEqual } from "crypto";

async function authenticateClient(projectKey: string, clientKey?: string | null, authorization?: string | null) {
  if (clientKey) {
    return secureCompare(clientKey, projectKey);
  } else if (authorization) {
    const [authType, token] = authorization.split(' ');

    if (authType === 'Bearer') {
      return secureCompare(token, projectKey);
    }
  }

  return false;
}

function secureCompare(a: string, b: string) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export { authenticateClient };
