import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import type { Database } from '../db';
import { leads } from '../db/schema';
import { createLeadSchema, updateLeadSchema } from '../lib/validation';
import { sendLeadNotification, sendLeadConfirmation } from '../lib/email';
import { trackLeadCreated } from '../lib/analytics';

type Env = {
  Variables: {
    db: Database;
  };
  Bindings: {
    ADMIN_EMAIL: string;
  };
};

const leadsRouter = new Hono<Env>();

// ==========================================
// PUBLIC ROUTES
// ==========================================

/**
 * POST /api/v1/leads
 * Crear un nuevo lead (desde formulario de contacto)
 */
leadsRouter.post(
  '/',
  zValidator('json', createLeadSchema),
  async (c) => {
    const db = c.get('db');
    const data = c.req.valid('json');

    try {
      // Insertar lead en la base de datos
      const [newLead] = await db
        .insert(leads)
        .values({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || null,
          excursionInteres: data.excursionInteres || null,
          mensaje: data.mensaje || null,
          source: data.source,
          utmSource: data.utmSource || null,
          utmMedium: data.utmMedium || null,
          utmCampaign: data.utmCampaign || null,
        })
        .returning();

      // Track en Posthog
      const sessionId = c.req.header('x-session-id') || `anonymous-${Date.now()}`;
      trackLeadCreated(sessionId, {
        email: newLead.email,
        excursion: newLead.excursionInteres || undefined,
        source: newLead.source || undefined,
      });

      // Enviar emails (async, no bloquean la respuesta)
      const adminEmail = c.env?.ADMIN_EMAIL || 'info@mallku.com.ar';

      // Notificación al admin
      sendLeadNotification(newLead, adminEmail).catch((err) => {
        console.error('Error sending admin notification:', err);
      });

      // Confirmación al usuario
      sendLeadConfirmation(newLead).catch((err) => {
        console.error('Error sending user confirmation:', err);
      });

      return c.json(
        {
          success: true,
          message: '¡Gracias por contactarnos! Te responderemos pronto.',
          data: {
            id: newLead.id,
            nombre: newLead.nombre,
            email: newLead.email,
          },
        },
        201
      );
    } catch (error) {
      console.error('Error creating lead:', error);
      return c.json(
        {
          success: false,
          message: 'Error al procesar tu solicitud. Por favor intenta de nuevo.',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  }
);

// ==========================================
// ADMIN ROUTES (require auth middleware)
// ==========================================

/**
 * GET /api/v1/leads
 * Listar leads con filtros y paginación
 */
leadsRouter.get('/', async (c) => {
  const db = c.get('db');

  // Query params
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const status = c.req.query('status');
  const search = c.req.query('search');

  try {
    // Por ahora, query simple sin filtros complejos
    const allLeads = await db.select().from(leads).orderBy(leads.createdAt);

    // Filtrar en memoria (mejorar con SQL en producción)
    let filteredLeads = allLeads;

    if (status) {
      filteredLeads = filteredLeads.filter((l) => l.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (l) =>
          l.nombre.toLowerCase().includes(searchLower) ||
          l.email.toLowerCase().includes(searchLower)
      );
    }

    // Paginación
    const total = filteredLeads.length;
    const offset = (page - 1) * limit;
    const paginatedLeads = filteredLeads.slice(offset, offset + limit);

    return c.json({
      success: true,
      data: paginatedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json(
      {
        success: false,
        message: 'Error al obtener leads',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/v1/leads/:id
 * Obtener un lead específico
 */
leadsRouter.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));

    if (!lead) {
      return c.json(
        {
          success: false,
          message: 'Lead no encontrado',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return c.json(
      {
        success: false,
        message: 'Error al obtener lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * PATCH /api/v1/leads/:id
 * Actualizar un lead
 */
leadsRouter.patch(
  '/:id',
  zValidator('json', updateLeadSchema),
  async (c) => {
    const db = c.get('db');
    const id = c.req.param('id');
    const data = c.req.valid('json');

    try {
      // Verificar que existe
      const [existing] = await db.select().from(leads).where(eq(leads.id, id));

      if (!existing) {
        return c.json(
          {
            success: false,
            message: 'Lead no encontrado',
          },
          404
        );
      }

      // Preparar datos de actualización
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (data.status) {
        updateData.status = data.status;

        // Timestamps según estado
        if (data.status === 'contacted' && !existing.contactedAt) {
          updateData.contactedAt = new Date();
        }
        if (data.status === 'converted' && !existing.convertedAt) {
          updateData.convertedAt = new Date();
        }
      }

      if (data.assignedTo !== undefined) {
        updateData.assignedTo = data.assignedTo;
      }

      if (data.notas !== undefined) {
        updateData.notas = data.notas;
      }

      if (data.tags !== undefined) {
        updateData.tags = data.tags;
      }

      // Actualizar
      const [updated] = await db
        .update(leads)
        .set(updateData)
        .where(eq(leads.id, id))
        .returning();

      return c.json({
        success: true,
        message: 'Lead actualizado',
        data: updated,
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      return c.json(
        {
          success: false,
          message: 'Error al actualizar lead',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  }
);

export default leadsRouter;
