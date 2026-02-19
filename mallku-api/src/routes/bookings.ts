import { Hono } from 'hono';
import { eq, desc, and, sql } from 'drizzle-orm';
import { bookings, dates, excursions, leads, type Booking } from '../db/schema';
import { createBookingSchema, reviewPropuestaSchema } from '../lib/validation';
import { authMiddleware } from '../lib/auth';
import { sendEmail } from '../lib/email';
import type { Database } from '../db';

type Bindings = {
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  POSTHOG_API_KEY: string;
  ADMIN_EMAIL: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
};

type Variables = {
  db: Database;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Helper: Generar número de reserva
function generateBookingNumber(tipo: 'fecha-fija' | 'personalizada'): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  const prefix = tipo === 'personalizada' ? 'MALLKU-PROP' : 'MALLKU';
  return `${prefix}-${yyyy}${mm}${dd}-${random}`;
}

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

/**
 * POST /api/v1/bookings
 * Crea una nueva reserva (dos modalidades)
 */
app.post('/', async (c) => {
  const db = c.get('db');
  const adminEmail = c.env?.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'mallkuexcursiones@gmail.com';
  const body = await c.req.json();

  // Validar input
  const validation = createBookingSchema.safeParse(body);
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

  // ===================================
  // MODALIDAD 1: FECHA FIJA
  // ===================================
  if (data.tipo === 'fecha-fija') {
    // Verificar disponibilidad de cupos
    const [date] = await db
      .select({
        id: dates.id,
        excursionId: dates.excursionId,
        cuposTotales: dates.cuposTotales,
        cuposReservados: dates.cuposReservados,
        cuposDisponibles: sql<number>`${dates.cuposTotales} - ${dates.cuposReservados}`,
        precioOverride: dates.precioOverride,
        excursionPrecioBase: excursions.precioBase,
        excursionTitulo: excursions.titulo,
        fecha: dates.fecha,
      })
      .from(dates)
      .innerJoin(excursions, eq(dates.excursionId, excursions.id))
      .where(eq(dates.id, data.dateId));

    if (!date) {
      return c.json(
        {
          success: false,
          message: 'Fecha no encontrada',
        },
        404
      );
    }

    // Check availability
    const cuposDisponibles = Number(date.cuposDisponibles);
    if (cuposDisponibles < data.cantidadPersonas) {
      return c.json(
        {
          success: false,
          message: `Solo quedan ${cuposDisponibles} cupos disponibles. Solicitaste ${data.cantidadPersonas}.`,
        },
        409
      );
    }

    // Calcular precio total
    const precioUnitario = date.precioOverride || date.excursionPrecioBase || 0;
    const precioTotal = precioUnitario * data.cantidadPersonas;

    // Generar booking number
    const bookingNumber = generateBookingNumber('fecha-fija');

    // Crear reserva
    const [newBooking] = await db
      .insert(bookings)
      .values({
        bookingNumber,
        tipo: 'fecha-fija',
        dateId: data.dateId,
        excursionId: date.excursionId,
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        telefono: data.telefono,
        dni: data.dni,
        cantidadPersonas: data.cantidadPersonas,
        precioTotal,
        notasCliente: data.notasCliente,
        status: 'confirmed', // Auto-confirmada
        paymentStatus: 'pending',
        confirmedAt: new Date(),
      })
      .returning();

    // Actualizar cupos reservados
    const nuevoCuposReservados = date.cuposReservados + data.cantidadPersonas;
    let nuevoEstado = date.cuposTotales === nuevoCuposReservados ? 'completo' :
                      date.cuposTotales - nuevoCuposReservados <= 3 ? 'pocos-cupos' :
                      'disponible';

    await db
      .update(dates)
      .set({
        cuposReservados: nuevoCuposReservados,
        estado: nuevoEstado as any,
        updatedAt: new Date(),
      })
      .where(eq(dates.id, data.dateId));

    // Enviar emails
    try {
      // Email al cliente
      await sendEmail({
        to: data.email,
        subject: `Reserva confirmada - ${date.excursionTitulo}`,
        html: `
          <h2>¡Reserva confirmada!</h2>
          <p>Hola ${data.nombreCompleto},</p>
          <p>Tu reserva ha sido confirmada exitosamente.</p>

          <h3>Detalles de la reserva:</h3>
          <ul>
            <li><strong>Número de reserva:</strong> ${bookingNumber}</li>
            <li><strong>Excursión:</strong> ${date.excursionTitulo}</li>
            <li><strong>Fecha:</strong> ${new Date(date.fecha).toLocaleDateString('es-AR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</li>
            <li><strong>Cantidad de personas:</strong> ${data.cantidadPersonas}</li>
            <li><strong>Precio total:</strong> $${(precioTotal / 100).toLocaleString('es-AR')}</li>
          </ul>

          <h3>Próximos pasos:</h3>
          <p>1. Realizá una seña del 30% ($${(precioTotal * 0.3 / 100).toLocaleString('es-AR')}) para confirmar tu lugar</p>
          <p>2. Te contactaremos por WhatsApp al ${data.telefono} para coordinar el pago</p>
          <p>3. El saldo restante se abona el día de la excursión</p>

          <p>¿Dudas? Respondé este email o escribinos por WhatsApp.</p>
          <p>Equipo Mallku</p>
        `,
      });

      // Email al admin
      await sendEmail({
        to: adminEmail,
        subject: `Nueva reserva - ${bookingNumber}`,
        html: `
          <h2>Nueva reserva recibida</h2>
          <ul>
            <li><strong>Booking:</strong> ${bookingNumber}</li>
            <li><strong>Cliente:</strong> ${data.nombreCompleto}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Teléfono:</strong> ${data.telefono}</li>
            <li><strong>Excursión:</strong> ${date.excursionTitulo}</li>
            <li><strong>Fecha:</strong> ${new Date(date.fecha).toLocaleDateString('es-AR')}</li>
            <li><strong>Personas:</strong> ${data.cantidadPersonas}</li>
            <li><strong>Total:</strong> $${(precioTotal / 100).toLocaleString('es-AR')}</li>
          </ul>
          ${data.notasCliente ? `<p><strong>Notas del cliente:</strong> ${data.notasCliente}</p>` : ''}
        `,
      });
    } catch (emailError) {
      console.error('Error enviando emails:', emailError);
      // No fallar el booking si el email falla
    }

    return c.json(
      {
        success: true,
        message: 'Reserva confirmada exitosamente',
        data: {
          bookingNumber,
          tipo: 'fecha-fija',
          status: 'confirmed',
          precioTotal,
        },
      },
      201
    );
  }

  // ===================================
  // MODALIDAD 2: PERSONALIZADA
  // ===================================
  if (data.tipo === 'personalizada') {
    // Buscar la excursión
    const [excursion] = await db
      .select()
      .from(excursions)
      .where(eq(excursions.slug, data.excursionSlug));

    if (!excursion) {
      return c.json(
        {
          success: false,
          message: 'Excursión no encontrada',
        },
        404
      );
    }

    // Validar que la fecha propuesta sea futura (mínimo 7 días adelante)
    const fechaPropuesta = new Date(data.fechaPropuesta);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);

    if (fechaPropuesta < minDate) {
      return c.json(
        {
          success: false,
          message: 'La fecha propuesta debe ser al menos 7 días en el futuro',
        },
        400
      );
    }

    // Generar booking number
    const bookingNumber = generateBookingNumber('personalizada');

    // Crear reserva con estado pendiente
    const [newBooking] = await db
      .insert(bookings)
      .values({
        bookingNumber,
        tipo: 'personalizada',
        dateId: null, // Aún no hay fecha asignada
        excursionId: excursion.id,
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        telefono: data.telefono,
        dni: data.dni,
        cantidadPersonas: data.cantidadPersonas,
        fechaPropuesta,
        estadoPropuesta: 'pendiente',
        precioTotal: null, // Se calcula cuando se aprueba
        notasCliente: data.notasCliente,
        status: 'pending',
        paymentStatus: 'pending',
      })
      .returning();

    // Enviar emails
    try {
      // Email al cliente
      await sendEmail({
        to: data.email,
        subject: `Propuesta recibida - ${excursion.titulo}`,
        html: `
          <h2>Propuesta recibida</h2>
          <p>Hola ${data.nombreCompleto},</p>
          <p>Recibimos tu propuesta de fecha personalizada para la excursión <strong>${excursion.titulo}</strong>.</p>

          <h3>Detalles de tu propuesta:</h3>
          <ul>
            <li><strong>Número de propuesta:</strong> ${bookingNumber}</li>
            <li><strong>Excursión:</strong> ${excursion.titulo}</li>
            <li><strong>Fecha propuesta:</strong> ${fechaPropuesta.toLocaleDateString('es-AR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</li>
            <li><strong>Cantidad de personas:</strong> ${data.cantidadPersonas}</li>
          </ul>

          <h3>Próximos pasos:</h3>
          <p>📋 Te confirmaremos disponibilidad en las próximas 24-48 horas por email y WhatsApp.</p>
          <p>⏱️ La propuesta NO está confirmada hasta que recibas nuestra aprobación.</p>
          <p>🔍 Podés consultar el estado en cualquier momento: <a href="https://mallku.com.ar/reservas/${bookingNumber}">Ver estado</a></p>

          <p>¿Dudas? Respondé este email o escribinos por WhatsApp al +54 9 3815 70-2549.</p>
          <p>Equipo Mallku</p>
        `,
      });

      // Email al admin (alta prioridad)
      await sendEmail({
        to: adminEmail,
        subject: `🔔 NUEVA PROPUESTA - Revisar Dashboard`,
        html: `
          <h2 style="color: #ff6b35;">⚠️ Nueva propuesta personalizada - REVISAR</h2>
          <ul>
            <li><strong>Booking:</strong> ${bookingNumber}</li>
            <li><strong>Cliente:</strong> ${data.nombreCompleto}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Teléfono:</strong> ${data.telefono}</li>
            <li><strong>Excursión:</strong> ${excursion.titulo}</li>
            <li><strong>Fecha propuesta:</strong> ${fechaPropuesta.toLocaleDateString('es-AR')}</li>
            <li><strong>Personas:</strong> ${data.cantidadPersonas}</li>
          </ul>
          ${data.notasCliente ? `<p><strong>Motivo/contexto:</strong> ${data.notasCliente}</p>` : ''}
          <p><a href="https://admin.mallku.com.ar/bookings?tab=propuestas&filter=pendientes" style="background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Revisar en Dashboard</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Error enviando emails:', emailError);
    }

    return c.json(
      {
        success: true,
        message: 'Propuesta enviada exitosamente. Te confirmaremos disponibilidad en 24-48hs.',
        data: {
          bookingNumber,
          tipo: 'personalizada',
          estadoPropuesta: 'pendiente',
          fechaPropuesta,
        },
      },
      201
    );
  }

  // Nunca debería llegar aquí (discriminated union garantiza tipo válido)
  return c.json({ success: false, message: 'Tipo de booking inválido' }, 400);
});

/**
 * GET /api/v1/bookings/:bookingNumber
 * Consulta pública de estado de reserva
 */
app.get('/:bookingNumber', async (c) => {
  const db = c.get('db');
  const bookingNumber = c.req.param('bookingNumber');

  const [booking] = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      tipo: bookings.tipo,
      nombreCompleto: bookings.nombreCompleto,
      email: bookings.email,
      telefono: bookings.telefono,
      cantidadPersonas: bookings.cantidadPersonas,
      precioTotal: bookings.precioTotal,
      status: bookings.status,
      paymentStatus: bookings.paymentStatus,
      fechaPropuesta: bookings.fechaPropuesta,
      estadoPropuesta: bookings.estadoPropuesta,
      motivoRechazo: bookings.motivoRechazo,
      notasCliente: bookings.notasCliente,
      createdAt: bookings.createdAt,
      confirmedAt: bookings.confirmedAt,

      excursionTitulo: excursions.titulo,
      excursionSlug: excursions.slug,

      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
    })
    .from(bookings)
    .innerJoin(excursions, eq(bookings.excursionId, excursions.id))
    .leftJoin(dates, eq(bookings.dateId, dates.id))
    .where(eq(bookings.bookingNumber, bookingNumber));

  if (!booking) {
    return c.json(
      {
        success: false,
        message: 'Reserva no encontrada',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: booking,
  });
});

// ==========================================
// RUTAS ADMIN (protegidas)
// ==========================================

app.use('/admin/*', authMiddleware());

/**
 * GET /api/v1/bookings/admin/all
 * Lista todas las reservas con filtros
 */
app.get('/admin/all', async (c) => {
  const db = c.get('db');

  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const tipo = c.req.query('tipo') as 'fecha-fija' | 'personalizada' | undefined;
  const status = c.req.query('status');
  const estadoPropuesta = c.req.query('estadoPropuesta');

  const allBookings = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      tipo: bookings.tipo,
      nombreCompleto: bookings.nombreCompleto,
      email: bookings.email,
      telefono: bookings.telefono,
      cantidadPersonas: bookings.cantidadPersonas,
      precioTotal: bookings.precioTotal,
      status: bookings.status,
      paymentStatus: bookings.paymentStatus,
      fechaPropuesta: bookings.fechaPropuesta,
      estadoPropuesta: bookings.estadoPropuesta,
      createdAt: bookings.createdAt,
      confirmedAt: bookings.confirmedAt,

      excursionTitulo: excursions.titulo,
      fecha: dates.fecha,
    })
    .from(bookings)
    .innerJoin(excursions, eq(bookings.excursionId, excursions.id))
    .leftJoin(dates, eq(bookings.dateId, dates.id))
    .orderBy(desc(bookings.createdAt));

  // Filtrar
  let filtered = allBookings;
  if (tipo) filtered = filtered.filter((b) => b.tipo === tipo);
  if (status) filtered = filtered.filter((b) => b.status === status);
  if (estadoPropuesta) filtered = filtered.filter((b) => b.estadoPropuesta === estadoPropuesta);

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
 * GET /api/v1/bookings/admin/:id
 * Detalle completo de una reserva (admin)
 */
app.get('/admin/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id));

  if (!booking) {
    return c.json(
      {
        success: false,
        message: 'Reserva no encontrada',
      },
      404
    );
  }

  // Get excursion details
  let excursion = null;
  if (booking.excursionId) {
    [excursion] = await db
      .select()
      .from(excursions)
      .where(eq(excursions.id, booking.excursionId));
  }

  // Get date details if exists
  let date = null;
  if (booking.dateId) {
    [date] = await db
      .select()
      .from(dates)
      .where(eq(dates.id, booking.dateId));
  }

  return c.json({
    success: true,
    data: {
      ...booking,
      excursion,
      date,
    },
  });
});

/**
 * PATCH /api/v1/bookings/admin/:id
 * Actualiza una reserva o revisa una propuesta
 */
app.patch('/admin/:id', async (c) => {
  const db = c.get('db');
  const adminEmail = c.env?.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'mallkuexcursiones@gmail.com';
  const id = c.req.param('id');
  const body = await c.req.json();

  // Get booking actual
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id));

  if (!booking) {
    return c.json({ success: false, message: 'Reserva no encontrada' }, 404);
  }

  // Si es una revisión de propuesta personalizada
  if (booking.tipo === 'personalizada' && (body.estadoPropuesta === 'aprobada' || body.estadoPropuesta === 'rechazada')) {
    const validation = reviewPropuestaSchema.safeParse(body);
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

    if (data.estadoPropuesta === 'aprobada') {
      // Verificar que la fecha existe
      const [date] = await db
        .select()
        .from(dates)
        .where(eq(dates.id, data.dateId));

      if (!date) {
        return c.json({ success: false, message: 'Fecha no encontrada' }, 404);
      }

      // Calcular precio
      if (!booking.excursionId) {
        return c.json({ success: false, message: 'Booking no tiene excursión asignada' }, 400);
      }

      const [excursion] = await db
        .select()
        .from(excursions)
        .where(eq(excursions.id, booking.excursionId));

      const precioUnitario = date.precioOverride || excursion.precioBase || 0;
      const precioTotal = precioUnitario * booking.cantidadPersonas;

      // Actualizar booking
      const [updated] = await db
        .update(bookings)
        .set({
          estadoPropuesta: 'aprobada',
          dateId: data.dateId,
          precioTotal,
          status: 'confirmed',
          confirmedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();

      // Actualizar cupos de la fecha
      await db
        .update(dates)
        .set({
          cuposReservados: date.cuposReservados + booking.cantidadPersonas,
          updatedAt: new Date(),
        })
        .where(eq(dates.id, data.dateId));

      // Email al cliente
      try {
        await sendEmail({
          to: booking.email,
          subject: `¡Propuesta aprobada! - ${excursion.titulo}`,
          html: `
            <h2>¡Tu propuesta fue aprobada!</h2>
            <p>Hola ${booking.nombreCompleto},</p>
            <p>Tenemos excelentes noticias: tu propuesta de fecha personalizada fue <strong>aprobada</strong>.</p>

            <h3>Detalles de tu reserva confirmada:</h3>
            <ul>
              <li><strong>Número de reserva:</strong> ${booking.bookingNumber}</li>
              <li><strong>Excursión:</strong> ${excursion.titulo}</li>
              <li><strong>Fecha confirmada:</strong> ${new Date(date.fecha).toLocaleDateString('es-AR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</li>
              <li><strong>Cantidad de personas:</strong> ${booking.cantidadPersonas}</li>
              <li><strong>Precio total:</strong> $${(precioTotal / 100).toLocaleString('es-AR')}</li>
            </ul>

            <h3>Próximos pasos:</h3>
            <p>1. Realizá una seña del 30% ($${(precioTotal * 0.3 / 100).toLocaleString('es-AR')}) para asegurar tu lugar</p>
            <p>2. Te contactaremos por WhatsApp al ${booking.telefono} para coordinar el pago</p>
            <p>3. El saldo restante se abona el día de la excursión</p>

            <p>¡Nos vemos en la excursión!</p>
            <p>Equipo Mallku</p>
          `,
        });
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
      }

      return c.json({
        success: true,
        message: 'Propuesta aprobada exitosamente',
        data: updated,
      });
    }

    if (data.estadoPropuesta === 'rechazada') {
      const [updated] = await db
        .update(bookings)
        .set({
          estadoPropuesta: 'rechazada',
          motivoRechazo: data.motivoRechazo,
          status: 'cancelled',
          cancelledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();

      // Email al cliente
      try {
        if (!booking.excursionId) {
          return c.json({ success: false, message: 'Booking no tiene excursión asignada' }, 400);
        }

        const [excursion] = await db
          .select()
          .from(excursions)
          .where(eq(excursions.id, booking.excursionId));

        await sendEmail({
          to: booking.email,
          subject: `Propuesta no disponible - ${excursion.titulo}`,
          html: `
            <h2>Propuesta no disponible</h2>
            <p>Hola ${booking.nombreCompleto},</p>
            <p>Lamentablemente no podemos confirmar la fecha propuesta para <strong>${excursion.titulo}</strong>.</p>

            <h3>Motivo:</h3>
            <p>${data.motivoRechazo}</p>

            <h3>Alternativas:</h3>
            <p>Te invitamos a:</p>
            <ul>
              <li>Revisar nuestro <a href="https://mallku.com.ar/calendario">calendario de fechas disponibles</a></li>
              <li>Proponernos otra fecha</li>
              <li>Contactarnos por WhatsApp al +54 9 3815 70-2549 para buscar opciones juntos</li>
            </ul>

            <p>Equipo Mallku</p>
          `,
        });
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
      }

      return c.json({
        success: true,
        message: 'Propuesta rechazada',
        data: updated,
      });
    }
  }

  // Actualización general (status, payment, notas internas)
  const updateData: any = { updatedAt: new Date() };
  if (body.status) updateData.status = body.status;
  if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
  if (body.notasInternas !== undefined) updateData.notasInternas = body.notasInternas;
  if (body.seniaPagada !== undefined) updateData.seniaPagada = body.seniaPagada;
  if (body.paymentReference !== undefined) updateData.paymentReference = body.paymentReference;

  const [updated] = await db
    .update(bookings)
    .set(updateData)
    .where(eq(bookings.id, id))
    .returning();

  return c.json({
    success: true,
    message: 'Reserva actualizada',
    data: updated,
  });
});

export default app;
