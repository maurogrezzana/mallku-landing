import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import { excursions, type Excursion } from '../db/schema';
import { createExcursionSchema, updateExcursionSchema } from '../lib/validation';
import { authMiddleware } from '../lib/auth';
import type { Database } from '../db';

type Variables = {
  db: Database;
};

const app = new Hono<{ Variables: Variables }>();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

/**
 * GET /api/v1/excursions
 * Lista todas las excursiones activas (catálogo público)
 */
app.get('/', async (c) => {
  const db = c.get('db');

  const allExcursions = await db
    .select()
    .from(excursions)
    .where(eq(excursions.isActive, true))
    .orderBy(excursions.orden, desc(excursions.createdAt));

  return c.json({
    success: true,
    data: allExcursions,
    totalCount: allExcursions.length,
  });
});

/**
 * GET /api/v1/excursions/:slug
 * Obtiene una excursión específica por slug (detalles completos)
 */
app.get('/:slug', async (c) => {
  const db = c.get('db');
  const slug = c.req.param('slug');

  const [excursion] = await db
    .select()
    .from(excursions)
    .where(and(eq(excursions.slug, slug), eq(excursions.isActive, true)));

  if (!excursion) {
    return c.json(
      {
        success: false,
        message: 'Excursión no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: excursion,
  });
});

// ==========================================
// RUTAS ADMIN (protegidas)
// ==========================================

app.use('/admin/*', authMiddleware());

/**
 * GET /api/v1/excursions/admin/all
 * Lista TODAS las excursiones (incluyendo inactivas)
 */
app.get('/admin/all', async (c) => {
  const db = c.get('db');

  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const includeInactive = c.req.query('includeInactive') === 'true';

  let query = db.select().from(excursions).orderBy(excursions.orden, desc(excursions.createdAt));

  if (!includeInactive) {
    query = db.select().from(excursions).where(eq(excursions.isActive, true)).orderBy(excursions.orden, desc(excursions.createdAt)) as any;
  }

  const allExcursions = await query;

  const total = allExcursions.length;
  const offset = (page - 1) * limit;
  const data = allExcursions.slice(offset, offset + limit);

  return c.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * POST /api/v1/excursions/admin
 * Crea una nueva excursión
 */
app.post('/admin', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();

  // Validar input
  const validation = createExcursionSchema.safeParse(body);
  if (!validation.success) {
    return c.json(
      {
        success: false,
        message: 'Datos inválidos',
        errors: validation.error.format(),
      },
      400
    );
  }

  const data = validation.data;

  // Verificar que el slug no exista
  const [existing] = await db
    .select()
    .from(excursions)
    .where(eq(excursions.slug, data.slug));

  if (existing) {
    return c.json(
      {
        success: false,
        message: 'Ya existe una excursión con ese slug',
      },
      409
    );
  }

  // Crear excursión
  const [newExcursion] = await db.insert(excursions).values(data).returning();

  return c.json(
    {
      success: true,
      message: 'Excursión creada exitosamente',
      data: newExcursion,
    },
    201
  );
});

/**
 * GET /api/v1/excursions/admin/:id
 * Obtiene una excursión específica por ID (para admin)
 */
app.get('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const [excursion] = await db
    .select()
    .from(excursions)
    .where(eq(excursions.id, id));

  if (!excursion) {
    return c.json(
      {
        success: false,
        message: 'Excursión no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: excursion,
  });
});

/**
 * PATCH /api/v1/excursions/admin/:id
 * Actualiza una excursión existente
 */
app.patch('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json();

  // Validar input
  const validation = updateExcursionSchema.safeParse(body);
  if (!validation.success) {
    return c.json(
      {
        success: false,
        message: 'Datos inválidos',
        errors: validation.error.format(),
      },
      400
    );
  }

  const data = validation.data;

  // Si se está actualizando el slug, verificar que no exista
  if (data.slug) {
    const [existing] = await db
      .select()
      .from(excursions)
      .where(and(eq(excursions.slug, data.slug), eq(excursions.id, id)));

    if (existing && existing.id !== id) {
      return c.json(
        {
          success: false,
          message: 'Ya existe una excursión con ese slug',
        },
        409
      );
    }
  }

  // Actualizar
  const [updated] = await db
    .update(excursions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(excursions.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        success: false,
        message: 'Excursión no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    message: 'Excursión actualizada exitosamente',
    data: updated,
  });
});

/**
 * DELETE /api/v1/excursions/admin/:id
 * Soft delete - marca como inactiva
 */
app.delete('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const [updated] = await db
    .update(excursions)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(excursions.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        success: false,
        message: 'Excursión no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    message: 'Excursión desactivada exitosamente',
    data: updated,
  });
});

export default app;
