import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import type { Database } from '../db';
import { users } from '../db/schema';
import { loginSchema } from '../lib/validation';
import { verifyPassword, hashPassword, createToken } from '../lib/auth';

type Env = {
  Variables: {
    db: Database;
  };
  Bindings: {
    JWT_SECRET: string;
  };
};

const authRouter = new Hono<Env>();

/**
 * POST /api/v1/auth/login
 */
authRouter.post(
  '/login',
  zValidator('json', loginSchema),
  async (c) => {
    const db = c.get('db');
    const { email, password } = c.req.valid('json');

    try {
      // Buscar usuario
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user || !user.isActive) {
        return c.json(
          { success: false, message: 'Credenciales inválidas' },
          401
        );
      }

      // Verificar password
      const validPassword = await verifyPassword(password, user.passwordHash);

      if (!validPassword) {
        return c.json(
          { success: false, message: 'Credenciales inválidas' },
          401
        );
      }

      // Crear token
      const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET || '';
      const token = await createToken(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          name: user.fullName,
        },
        jwtSecret
      );

      // Actualizar último login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      return c.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json(
        { success: false, message: 'Error en el servidor' },
        500
      );
    }
  }
);

/**
 * POST /api/v1/auth/setup
 * Crear el primer usuario admin (solo si no hay usuarios)
 */
authRouter.post(
  '/setup',
  zValidator('json', loginSchema),
  async (c) => {
    const db = c.get('db');
    const { email, password } = c.req.valid('json');

    try {
      // Verificar que no existan usuarios
      const existingUsers = await db.select().from(users);

      if (existingUsers.length > 0) {
        return c.json(
          { success: false, message: 'El sistema ya fue configurado' },
          403
        );
      }

      // Crear admin
      const passwordHash = await hashPassword(password);
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          fullName: 'Administrador',
          role: 'admin',
        })
        .returning();

      // Crear token
      const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET || '';
      const token = await createToken(
        {
          sub: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.fullName,
        },
        jwtSecret
      );

      return c.json({
        success: true,
        message: 'Admin creado exitosamente',
        data: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
          },
        },
      });
    } catch (error) {
      console.error('Setup error:', error);
      return c.json(
        { success: false, message: 'Error en el servidor' },
        500
      );
    }
  }
);

export default authRouter;
