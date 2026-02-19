/**
 * api/index.ts — Vercel Serverless Function Entry Point
 *
 * Manual adapter: reads Node.js body stream before passing to Hono.
 * @hono/node-server/vercel has issues reading POST bodies on Vercel Node.js 20.
 */
import type { IncomingMessage, ServerResponse } from 'http';
import app from '../src/index';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = (req.headers.host as string) || 'mallku-api.vercel.app';
  const url = new URL(req.url || '/', `https://${host}`);

  // Build Headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  // Read body for POST/PATCH/PUT/DELETE
  const method = (req.method || 'GET').toUpperCase();
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const body = hasBody ? await readBody(req) : null;

  // Build Web API Request
  const webReq = new Request(url.toString(), {
    method,
    headers,
    body: body && body.length > 0 ? body : null,
  });

  // Dispatch to Hono
  const webRes = await app.fetch(webReq);

  // Forward response
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const buffer = await webRes.arrayBuffer();
  res.end(Buffer.from(buffer));
}
