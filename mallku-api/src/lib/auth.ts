import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;
import type { Context, Next } from 'hono';

const SALT_ROUNDS = 10;

// ==========================================
// PASSWORD HASHING
// ==========================================

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ==========================================
// JWT
// ==========================================

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  name: string;
}

export async function createToken(payload: JwtPayload, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

export async function verifyToken(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Token requerido' }, 401);
    }

    const token = authHeader.slice(7);
    const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET || '';

    const payload = await verifyToken(token, jwtSecret);

    if (!payload) {
      return c.json({ success: false, message: 'Token inválido o expirado' }, 401);
    }

    // Guardar usuario en contexto
    c.set('user', payload);

    await next();
  };
}
