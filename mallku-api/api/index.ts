/**
 * api/index.ts — Vercel Serverless Function Entry Point
 *
 * Wraps the Hono app using @hono/node-server/vercel adapter.
 * This adapter correctly handles Node.js IncomingMessage → Web API Request conversion.
 * All requests are routed through this file via vercel.json.
 */
import { handle } from '@hono/node-server/vercel';
import app from '../src/index';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handle(app);
