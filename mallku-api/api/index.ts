import { handle } from 'hono/vercel';
import { config } from 'dotenv';

config();

import app from '../src/index';

export default handle(app);
