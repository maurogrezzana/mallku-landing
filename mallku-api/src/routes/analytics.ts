import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Database } from '../db';
import { events } from '../db/schema';
import { trackEventSchema } from '../lib/validation';
import { trackEvent, trackPageView } from '../lib/analytics';

type Env = {
  Variables: {
    db: Database;
  };
};

const analyticsRouter = new Hono<Env>();

/**
 * POST /api/v1/analytics/track
 * Trackear un evento desde el frontend
 */
analyticsRouter.post(
  '/track',
  zValidator('json', trackEventSchema),
  async (c) => {
    const db = c.get('db');
    const data = c.req.valid('json');

    try {
      // Guardar en nuestra DB
      const [newEvent] = await db
        .insert(events)
        .values({
          sessionId: data.sessionId,
          eventType: data.eventType,
          eventName: data.eventName,
          properties: data.properties,
          pageUrl: data.pageUrl || null,
          referrer: data.referrer || null,
          userAgent: c.req.header('user-agent') || null,
        })
        .returning();

      // Enviar a Posthog
      if (data.eventType === 'page_view') {
        trackPageView(data.sessionId, {
          url: data.pageUrl || '',
          referrer: data.referrer,
        });
      } else {
        trackEvent({
          distinctId: data.sessionId,
          event: data.eventName,
          properties: {
            ...data.properties,
            event_type: data.eventType,
            page_url: data.pageUrl,
            referrer: data.referrer,
          },
        });
      }

      return c.json({
        success: true,
        data: {
          id: newEvent.id,
          eventName: newEvent.eventName,
        },
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      // No retornar error al usuario para no bloquear la UX
      return c.json({
        success: true,
        message: 'Event queued',
      });
    }
  }
);

/**
 * GET /api/v1/analytics/overview
 * Estadísticas generales (para dashboard admin)
 */
analyticsRouter.get('/overview', async (c) => {
  const db = c.get('db');

  try {
    // Contar eventos por tipo
    const allEvents = await db.select().from(events);

    const pageViews = allEvents.filter((e) => e.eventType === 'page_view').length;
    const formSubmits = allEvents.filter((e) => e.eventType === 'form_submit').length;
    const uniqueSessions = new Set(allEvents.map((e) => e.sessionId)).size;

    // Eventos últimas 24h
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEvents = allEvents.filter((e) => new Date(e.createdAt) > yesterday);

    return c.json({
      success: true,
      data: {
        totalEvents: allEvents.length,
        pageViews,
        formSubmits,
        uniqueSessions,
        last24h: {
          events: recentEvents.length,
          sessions: new Set(recentEvents.map((e) => e.sessionId)).size,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json(
      {
        success: false,
        message: 'Error al obtener analytics',
      },
      500
    );
  }
});

export default analyticsRouter;
