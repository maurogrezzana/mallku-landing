import { Hono } from 'hono';
import { and, gte, lte, eq, ne, or, asc } from 'drizzle-orm';
import { dates, excursions, bookings } from '../db/schema';
import { authMiddleware } from '../lib/auth';
import { sendEmail, getReminderEmailHtml } from '../lib/email';
import type { Database } from '../db';

type Variables = { db: Database };

const app = new Hono<{ Variables: Variables }>();

// ==========================================
// GET /upcoming?days=7
// Próximas fechas con clientes confirmados
// ==========================================

app.get('/upcoming', authMiddleware(), async (c) => {
  const db = c.get('db');
  const days = Math.min(parseInt(c.req.query('days') || '7'), 30);

  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Fechas en el rango con join de excursión
  const upcomingDates = await db
    .select({
      id: dates.id,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      cuposTotales: dates.cuposTotales,
      cuposReservados: dates.cuposReservados,
      estado: dates.estado,
      notas: dates.notas,
      excursionId: excursions.id,
      excursionTitulo: excursions.titulo,
      excursionSlug: excursions.slug,
    })
    .from(dates)
    .leftJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(
      and(
        gte(dates.fecha, now),
        lte(dates.fecha, future),
        ne(dates.estado, 'cancelado' as any)
      )
    )
    .orderBy(asc(dates.fecha));

  // Para cada fecha, obtener los bookings confirmados/pagados
  const result = await Promise.all(
    upcomingDates.map(async (d) => {
      const dateBookings = await db
        .select({
          id: bookings.id,
          nombreCompleto: bookings.nombreCompleto,
          email: bookings.email,
          telefono: bookings.telefono,
          cantidadPersonas: bookings.cantidadPersonas,
          status: bookings.status,
          paymentStatus: bookings.paymentStatus,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.dateId, d.id),
            or(
              eq(bookings.status, 'confirmed' as any),
              eq(bookings.status, 'paid' as any)
            )
          )
        );

      return {
        date: {
          id: d.id,
          fecha: d.fecha,
          horaSalida: d.horaSalida,
          cuposTotales: d.cuposTotales,
          cuposReservados: d.cuposReservados,
          estado: d.estado,
          notas: d.notas,
        },
        excursion: {
          id: d.excursionId,
          titulo: d.excursionTitulo,
          slug: d.excursionSlug,
        },
        bookings: dateBookings,
      };
    })
  );

  return c.json({ success: true, data: result });
});

// ==========================================
// POST /send-reminder/:dateId
// Enviar recordatorio a clientes de una fecha
// ==========================================

app.post('/send-reminder/:dateId', authMiddleware(), async (c) => {
  const db = c.get('db');
  const dateId = c.req.param('dateId');

  // Obtener fecha + excursión
  const [dateRow] = await db
    .select({
      id: dates.id,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      notas: dates.notas,
      excursionTitulo: excursions.titulo,
    })
    .from(dates)
    .leftJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(eq(dates.id, dateId));

  if (!dateRow) {
    return c.json({ success: false, message: 'Fecha no encontrada' }, 404);
  }

  // Obtener clientes confirmados de esa fecha
  const confirmedBookings = await db
    .select({
      id: bookings.id,
      nombreCompleto: bookings.nombreCompleto,
      email: bookings.email,
      cantidadPersonas: bookings.cantidadPersonas,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.dateId, dateId),
        or(
          eq(bookings.status, 'confirmed' as any),
          eq(bookings.status, 'paid' as any)
        )
      )
    );

  if (confirmedBookings.length === 0) {
    return c.json({
      success: true,
      data: { sent: 0, errors: [], total: 0, message: 'No hay clientes confirmados para esta fecha' },
    });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const booking of confirmedBookings) {
    const html = getReminderEmailHtml({
      nombreCliente: booking.nombreCompleto,
      excursionTitulo: dateRow.excursionTitulo || 'Excursión',
      fecha: dateRow.fecha.toISOString(),
      horaSalida: dateRow.horaSalida || undefined,
      puntoEncuentro: dateRow.notas || undefined,
    });

    const ok = await sendEmail({
      to: booking.email,
      subject: `Recordatorio: tu excursión "${dateRow.excursionTitulo}" - Mallku`,
      html,
    });

    if (ok) sent++;
    else errors.push(booking.email);
  }

  return c.json({
    success: true,
    data: { sent, errors, total: confirmedBookings.length },
  });
});

export default app;
