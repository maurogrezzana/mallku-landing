import { Hono } from 'hono';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { dates, excursions, type DateSalida } from '../db/schema';
import { createDateSchema, updateDateSchema } from '../lib/validation';
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
 * GET /api/v1/calendar
 * Retorna todas las fechas disponibles agrupadas por mes
 * Filtros: ?excursion=slug, ?from=YYYY-MM-DD, ?to=YYYY-MM-DD
 */
app.get('/calendar', async (c) => {
  const db = c.get('db');

  const excursionSlug = c.req.query('excursion');
  const from = c.req.query('from');
  const to = c.req.query('to');

  let query = db
    .select({
      id: dates.id,
      excursionId: dates.excursionId,
      excursionSlug: excursions.slug,
      excursionTitulo: excursions.titulo,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      cuposTotales: dates.cuposTotales,
      cuposReservados: dates.cuposReservados,
      cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
      estado: dates.estado,
      precioOverride: dates.precioOverride,
      precioBase: excursions.precioBase,
    })
    .from(dates)
    .innerJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(
      and(
        eq(excursions.isActive, true),
        gte(dates.fecha, new Date())
      )
    )
    .orderBy(dates.fecha);

  // Filtrar por excursión si se especifica
  if (excursionSlug) {
    query = db
      .select({
        id: dates.id,
        excursionId: dates.excursionId,
        excursionSlug: excursions.slug,
        excursionTitulo: excursions.titulo,
        fecha: dates.fecha,
        horaSalida: dates.horaSalida,
        cuposTotales: dates.cuposTotales,
        cuposReservados: dates.cuposReservados,
        cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
        estado: dates.estado,
        precioOverride: dates.precioOverride,
        precioBase: excursions.precioBase,
      })
      .from(dates)
      .innerJoin(excursions, eq(dates.excursionId, excursions.id))
      .where(
        and(
          eq(excursions.isActive, true),
          eq(excursions.slug, excursionSlug),
          gte(dates.fecha, new Date())
        )
      )
      .orderBy(dates.fecha) as any;
  }

  // Filtrar por rango de fechas
  if (from) {
    const fromDate = new Date(from);
    query = db
      .select({
        id: dates.id,
        excursionId: dates.excursionId,
        excursionSlug: excursions.slug,
        excursionTitulo: excursions.titulo,
        fecha: dates.fecha,
        horaSalida: dates.horaSalida,
        cuposTotales: dates.cuposTotales,
        cuposReservados: dates.cuposReservados,
        cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
        estado: dates.estado,
        precioOverride: dates.precioOverride,
        precioBase: excursions.precioBase,
      })
      .from(dates)
      .innerJoin(excursions, eq(dates.excursionId, excursions.id))
      .where(
        and(
          eq(excursions.isActive, true),
          gte(dates.fecha, fromDate),
          excursionSlug ? eq(excursions.slug, excursionSlug) : undefined
        )
      )
      .orderBy(dates.fecha) as any;
  }

  if (to) {
    const toDate = new Date(to);
    query = db
      .select({
        id: dates.id,
        excursionId: dates.excursionId,
        excursionSlug: excursions.slug,
        excursionTitulo: excursions.titulo,
        fecha: dates.fecha,
        horaSalida: dates.horaSalida,
        cuposTotales: dates.cuposTotales,
        cuposReservados: dates.cuposReservados,
        cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
        estado: dates.estado,
        precioOverride: dates.precioOverride,
        precioBase: excursions.precioBase,
      })
      .from(dates)
      .innerJoin(excursions, eq(dates.excursionId, excursions.id))
      .where(
        and(
          eq(excursions.isActive, true),
          gte(dates.fecha, from ? new Date(from) : new Date()),
          lte(dates.fecha, toDate),
          excursionSlug ? eq(excursions.slug, excursionSlug) : undefined
        )
      )
      .orderBy(dates.fecha) as any;
  }

  const allDates = await query;

  return c.json({
    success: true,
    data: allDates,
    totalCount: allDates.length,
  });
});

/**
 * GET /api/v1/excursions/:slug/dates
 * Retorna fechas disponibles para una excursión específica
 */
app.get('/excursions/:slug/dates', async (c) => {
  const db = c.get('db');
  const slug = c.req.param('slug');

  // Buscar la excursión
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

  // Buscar fechas disponibles
  const availableDates = await db
    .select({
      id: dates.id,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      cuposTotales: dates.cuposTotales,
      cuposReservados: dates.cuposReservados,
      cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
      estado: dates.estado,
      precio: sql<number>`COALESCE(${dates.precioOverride}, ${excursions.precioBase})`,
    })
    .from(dates)
    .innerJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(
      and(
        eq(dates.excursionId, excursion.id),
        gte(dates.fecha, new Date())
      )
    )
    .orderBy(dates.fecha);

  return c.json({
    success: true,
    data: {
      excursion: {
        id: excursion.id,
        slug: excursion.slug,
        titulo: excursion.titulo,
        descripcion: excursion.descripcion,
        duracion: excursion.duracion,
        precioBase: excursion.precioBase,
        grupoMax: excursion.grupoMax,
      },
      dates: availableDates,
    },
  });
});

/**
 * GET /api/v1/dates/:id
 * Obtiene una fecha específica por ID (info detallada)
 */
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const [date] = await db
    .select({
      id: dates.id,
      excursionId: dates.excursionId,
      excursionSlug: excursions.slug,
      excursionTitulo: excursions.titulo,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      cuposTotales: dates.cuposTotales,
      cuposReservados: dates.cuposReservados,
      cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
      estado: dates.estado,
      precioOverride: dates.precioOverride,
      precioBase: excursions.precioBase,
      notas: dates.notas,
    })
    .from(dates)
    .innerJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(eq(dates.id, id));

  if (!date) {
    return c.json(
      {
        success: false,
        message: 'Fecha no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: date,
  });
});

// ==========================================
// RUTAS ADMIN (protegidas)
// ==========================================

app.use('/admin/*', authMiddleware());

/**
 * GET /api/v1/dates/admin/all
 * Lista todas las fechas (incluyendo pasadas)
 */
app.get('/admin/all', async (c) => {
  const db = c.get('db');

  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const excursionId = c.req.query('excursionId');
  const estado = c.req.query('estado');

  let query = db
    .select({
      id: dates.id,
      excursionId: dates.excursionId,
      excursionSlug: excursions.slug,
      excursionTitulo: excursions.titulo,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      cuposTotales: dates.cuposTotales,
      cuposReservados: dates.cuposReservados,
      cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
      estado: dates.estado,
      precioOverride: dates.precioOverride,
      precioBase: excursions.precioBase,
      notas: dates.notas,
      createdAt: dates.createdAt,
      updatedAt: dates.updatedAt,
    })
    .from(dates)
    .innerJoin(excursions, eq(dates.excursionId, excursions.id))
    .orderBy(desc(dates.fecha));

  // Aplicar filtros
  if (excursionId) {
    query = db
      .select({
        id: dates.id,
        excursionId: dates.excursionId,
        excursionSlug: excursions.slug,
        excursionTitulo: excursions.titulo,
        fecha: dates.fecha,
        horaSalida: dates.horaSalida,
        cuposTotales: dates.cuposTotales,
        cuposReservados: dates.cuposReservados,
        cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
        estado: dates.estado,
        precioOverride: dates.precioOverride,
        precioBase: excursions.precioBase,
        notas: dates.notas,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt,
      })
      .from(dates)
      .innerJoin(excursions, eq(dates.excursionId, excursions.id))
      .where(eq(dates.excursionId, excursionId))
      .orderBy(desc(dates.fecha)) as any;
  }

  const allDates = await query;

  // Filtrar por estado si se especifica (en memoria porque estado es enum)
  let filtered = allDates;
  if (estado) {
    filtered = allDates.filter((d) => d.estado === estado);
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

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
 * POST /api/v1/dates/admin
 * Crea una nueva fecha de salida
 */
app.post('/admin', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();

  // Validar input
  const validation = createDateSchema.safeParse(body);
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

  // Verificar que la excursión exista
  const [excursion] = await db
    .select()
    .from(excursions)
    .where(eq(excursions.id, data.excursionId));

  if (!excursion) {
    return c.json(
      {
        success: false,
        message: 'Excursión no encontrada',
      },
      404
    );
  }

  // Crear la fecha
  const [newDate] = await db
    .insert(dates)
    .values({
      excursionId: data.excursionId,
      fecha: new Date(data.fecha),
      horaSalida: data.horaSalida,
      cuposTotales: data.cuposTotales,
      precioOverride: data.precioOverride,
      notas: data.notas,
    })
    .returning();

  return c.json(
    {
      success: true,
      message: 'Fecha creada exitosamente',
      data: newDate,
    },
    201
  );
});

/**
 * PATCH /api/v1/dates/admin/:id
 * Actualiza una fecha existente
 */
app.patch('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json();

  // Validar input
  const validation = updateDateSchema.safeParse(body);
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

  // Actualizar
  const updateData: any = { updatedAt: new Date() };
  if (data.fecha) updateData.fecha = new Date(data.fecha);
  if (data.horaSalida !== undefined) updateData.horaSalida = data.horaSalida;
  if (data.cuposTotales !== undefined) updateData.cuposTotales = data.cuposTotales;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.precioOverride !== undefined) updateData.precioOverride = data.precioOverride;
  if (data.notas !== undefined) updateData.notas = data.notas;

  const [updated] = await db
    .update(dates)
    .set(updateData)
    .where(eq(dates.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        success: false,
        message: 'Fecha no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    message: 'Fecha actualizada exitosamente',
    data: updated,
  });
});

/**
 * DELETE /api/v1/dates/admin/:id
 * Soft delete - marca como cancelada
 */
app.delete('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const [updated] = await db
    .update(dates)
    .set({ estado: 'cancelado', updatedAt: new Date() })
    .where(eq(dates.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        success: false,
        message: 'Fecha no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    message: 'Fecha cancelada exitosamente',
    data: updated,
  });
});

export default app;
