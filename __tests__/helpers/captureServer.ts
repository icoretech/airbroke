import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

export type CapturedRequest = {
  method: string | undefined;
  url: string | undefined;
  headers: Record<string, string | string[] | undefined>;
  bodyRaw: Uint8Array;
  bodyText: string;
};

export async function startCaptureServer(options?: {
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
}): Promise<{
  baseUrl: string;
  requests: CapturedRequest[];
  close: () => Promise<void>;
}> {
  const requests: CapturedRequest[] = [];
  const responseStatus = options?.responseStatus ?? 201;
  const responseHeaders = options?.responseHeaders ?? {
    "content-type": "application/json",
  };
  const responseBody =
    options?.responseBody ??
    JSON.stringify({ id: "n1", url: "http://localhost/projects/p1" });

  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => {
      const bodyBuffer = Buffer.concat(chunks);
      requests.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        bodyRaw: bodyBuffer,
        bodyText: bodyBuffer.toString("utf8"),
      });

      res.statusCode = responseStatus;
      for (const [key, value] of Object.entries(responseHeaders)) {
        res.setHeader(key, value);
      }
      res.end(responseBody);
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to bind capture server");
  }

  const baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}`;

  const close = async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  return { baseUrl, requests, close };
}
