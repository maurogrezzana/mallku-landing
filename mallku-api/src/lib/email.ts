import { Resend } from 'resend';
import type { Lead } from '../db/schema';

let resend: Resend | null = null;

export function initResend(apiKey: string) {
  resend = new Resend(apiKey);
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================

function getLeadNotificationHtml(lead: Lead): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .value { margin-top: 4px; font-size: 16px; color: #333; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 24px;
               text-decoration: none; border-radius: 6px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">🦅 Nuevo Lead - Mallku</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nombre</div>
            <div class="value">${lead.nombre}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
          </div>
          ${lead.telefono ? `
          <div class="field">
            <div class="label">Teléfono</div>
            <div class="value"><a href="tel:${lead.telefono}">${lead.telefono}</a></div>
          </div>
          ` : ''}
          ${lead.excursionInteres ? `
          <div class="field">
            <div class="label">Excursión de interés</div>
            <div class="value">${lead.excursionInteres}</div>
          </div>
          ` : ''}
          ${lead.mensaje ? `
          <div class="field">
            <div class="label">Mensaje</div>
            <div class="value">${lead.mensaje}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Fuente</div>
            <div class="value">${lead.source || 'Website'}</div>
          </div>
          <div class="field">
            <div class="label">Fecha</div>
            <div class="value">${new Date(lead.createdAt).toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires'
            })}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getLeadConfirmationHtml(lead: Lead): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 20px; }
        .logo { font-size: 48px; margin-bottom: 10px; }
        .title { color: #1a1a2e; font-size: 24px; margin: 0; }
        .content { padding: 20px; line-height: 1.6; }
        .highlight { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c9a227; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .social a { margin: 0 10px; color: #c9a227; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🦅</div>
          <h1 class="title">Mallku - Turismo Arqueológico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${lead.nombre}</strong>,</p>
          <p>¡Gracias por contactarnos! Recibimos tu mensaje y nos pondremos en contacto contigo muy pronto.</p>

          <div class="highlight">
            <p style="margin: 0;"><strong>¿Qué sigue?</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Te responderemos en menos de 24 horas</li>
              <li>Te enviaremos información detallada sobre nuestras excursiones</li>
              <li>Coordinaremos la mejor fecha para tu aventura</li>
            </ul>
          </div>

          <p>Mientras tanto, podés explorar nuestras excursiones en <a href="https://mallku.com.ar/excursiones" style="color: #c9a227;">mallku.com.ar</a></p>

          <p>¡Nos vemos pronto en el camino!</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <div class="social">
            <a href="https://instagram.com/mallku.noa">Instagram</a>
            <a href="https://wa.me/5493815825570">WhatsApp</a>
          </div>
          <p style="margin-top: 15px;">Mallku - Turismo Arqueológico NOA</p>
          <p>San Miguel de Tucumán, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// EMAIL FUNCTIONS
// ==========================================

export async function sendLeadNotification(lead: Lead, adminEmail: string): Promise<boolean> {
  if (!resend) {
    console.error('Resend not initialized');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Mallku CRM <onboarding@resend.dev>',
      to: adminEmail,
      subject: `🦅 Nuevo contacto: ${lead.nombre}`,
      html: getLeadNotificationHtml(lead),
    });

    if (error) {
      console.error('Error sending lead notification:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error sending lead notification:', err);
    return false;
  }
}

export async function sendLeadConfirmation(lead: Lead): Promise<boolean> {
  if (!resend) {
    console.error('Resend not initialized');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Mallku <onboarding@resend.dev>',
      to: lead.email,
      subject: '¡Gracias por contactarnos! - Mallku',
      html: getLeadConfirmationHtml(lead),
    });

    if (error) {
      console.error('Error sending lead confirmation:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error sending lead confirmation:', err);
    return false;
  }
}
