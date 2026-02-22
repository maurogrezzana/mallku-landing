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

// ==========================================
// REMINDER EMAIL TEMPLATE
// ==========================================

interface ReminderEmailParams {
  nombreCliente: string;
  excursionTitulo: string;
  fecha: string; // ISO string
  horaSalida?: string;
  puntoEncuentro?: string;
}

export function getReminderEmailHtml(params: ReminderEmailParams): string {
  const { nombreCliente, excursionTitulo, fecha, horaSalida, puntoEncuentro } = params;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { background: #f8f9fa; padding: 28px; }
        .highlight { background: white; border-left: 4px solid #c9a227; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .highlight p { margin: 6px 0; font-size: 15px; }
        .highlight strong { color: #1a1a2e; }
        .info-row { display: flex; gap: 8px; margin: 6px 0; }
        .label { font-weight: bold; min-width: 130px; color: #555; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
        .footer a { color: #c9a227; text-decoration: none; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 28px;
               text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mallku — Turismo Arqueologico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>Te recordamos que tenes una excursion programada. Aqui los detalles:</p>

          <div class="highlight">
            <p><strong>${excursionTitulo}</strong></p>
            <p><span class="label">Fecha:</span> ${fechaFormateada}</p>
            ${horaSalida ? `<p><span class="label">Hora de salida:</span> ${horaSalida} hs</p>` : ''}
            ${puntoEncuentro ? `<p><span class="label">Punto de encuentro:</span> ${puntoEncuentro}</p>` : ''}
          </div>

          <p><strong>Recordaciones importantes:</strong></p>
          <ul>
            <li>Llegar 10 minutos antes de la hora de salida</li>
            <li>Traer ropa comoda y calzado cerrado</li>
            <li>Llevar agua y protector solar</li>
            <li>Ante cualquier consulta, escribinos por WhatsApp</li>
          </ul>

          <p style="margin-top: 24px;">
            <a href="https://wa.me/5493815825570" class="cta">Consultar por WhatsApp</a>
          </p>

          <p style="margin-top: 20px;">iNos vemos pronto en el camino!</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <a href="https://mallku.com.ar">mallku.com.ar</a> &bull;
          <a href="https://instagram.com/mallku.noa">@mallku.noa</a> &bull;
          <a href="https://wa.me/5493815825570">WhatsApp</a>
          <p style="margin-top: 8px; color: #999;">San Miguel de Tucuman, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// BALANCE REMINDER EMAIL TEMPLATE
// ==========================================

interface BalanceReminderEmailParams {
  nombreCliente: string;
  excursionTitulo: string;
  fecha: string;
  horaSalida?: string;
  precioTotal: number; // en centavos
  seniaPagada: number; // en centavos
  saldoPendiente: number; // en centavos
}

export function getBalanceReminderEmailHtml(params: BalanceReminderEmailParams): string {
  const { nombreCliente, excursionTitulo, fecha, horaSalida, precioTotal, seniaPagada, saldoPendiente } = params;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatARS = (centavos: number) => `$${(centavos / 100).toLocaleString('es-AR')}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { background: #f8f9fa; padding: 28px; }
        .highlight { background: white; border-left: 4px solid #c9a227; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .highlight p { margin: 6px 0; font-size: 15px; }
        .balance-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .balance-table td { padding: 8px 12px; border-bottom: 1px solid #e9ecef; font-size: 15px; }
        .balance-table td:last-child { text-align: right; font-weight: bold; }
        .balance-total { background: #fff3cd; }
        .balance-total td { color: #856404; border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
        .footer a { color: #c9a227; text-decoration: none; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 28px;
               text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mallku — Turismo Arqueologico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>Te recordamos que tenes un saldo pendiente para abonar antes de tu excursion:</p>

          <div class="highlight">
            <p><strong>${excursionTitulo}</strong></p>
            <p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Fecha:</span> ${fechaFormateada}</p>
            ${horaSalida ? `<p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Hora de salida:</span> ${horaSalida} hs</p>` : ''}
          </div>

          <table class="balance-table">
            <tr>
              <td>Precio total de la excursion</td>
              <td>${formatARS(precioTotal)}</td>
            </tr>
            <tr>
              <td>Sena / Pago realizado</td>
              <td>${formatARS(seniaPagada)}</td>
            </tr>
            <tr class="balance-total">
              <td><strong>Saldo pendiente</strong></td>
              <td><strong>${formatARS(saldoPendiente)}</strong></td>
            </tr>
          </table>

          <p>Para abonar el saldo, podés hacerlo mediante:</p>
          <ul>
            <li><strong>Transferencia bancaria</strong> — Consultanos el CBU/Alias por WhatsApp</li>
            <li><strong>MercadoPago</strong> — Te enviamos el link de pago si lo necesitas</li>
            <li><strong>Efectivo</strong> — El dia de la excursion al momento del encuentro</li>
          </ul>

          <p style="margin-top: 24px;">
            <a href="https://wa.me/5493815825570" class="cta">Consultar por WhatsApp</a>
          </p>

          <p style="margin-top: 20px;">Gracias por elegirnos, te esperamos pronto!</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <a href="https://mallku.com.ar">mallku.com.ar</a> &bull;
          <a href="https://instagram.com/mallku.noa">@mallku.noa</a> &bull;
          <a href="https://wa.me/5493815825570">WhatsApp</a>
          <p style="margin-top: 8px; color: #999;">San Miguel de Tucuman, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// EXCURSION INFO EMAIL TEMPLATE
// ==========================================

interface ExcursionInfoEmailParams {
  nombreCliente: string;
  excursionTitulo: string;
  fecha: string;
  horaSalida?: string;
  puntoEncuentro?: string;
  notas?: string;
}

export function getExcursionInfoEmailHtml(params: ExcursionInfoEmailParams): string {
  const { nombreCliente, excursionTitulo, fecha, horaSalida, puntoEncuentro, notas } = params;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { background: #f8f9fa; padding: 28px; }
        .highlight { background: white; border-left: 4px solid #c9a227; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .highlight p { margin: 6px 0; font-size: 15px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
        .footer a { color: #c9a227; text-decoration: none; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 28px;
               text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mallku — Turismo Arqueologico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>Aqui te enviamos toda la informacion para tu excursion. Guardala para el dia de la salida:</p>

          <div class="highlight">
            <p><strong>${excursionTitulo}</strong></p>
            <p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Fecha:</span> ${fechaFormateada}</p>
            ${horaSalida ? `<p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Hora de salida:</span> ${horaSalida} hs</p>` : ''}
            ${puntoEncuentro ? `<p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Punto de encuentro:</span> ${puntoEncuentro}</p>` : ''}
            ${notas && notas !== puntoEncuentro ? `<p><span style="font-weight:bold;min-width:130px;display:inline-block;color:#555;">Notas:</span> ${notas}</p>` : ''}
          </div>

          <p><strong>Que llevar el dia de la excursion:</strong></p>
          <ul>
            <li>Ropa comoda y calzado cerrado (recomendamos zapatillas de trekking)</li>
            <li>Agua (minimo 1.5 litros por persona)</li>
            <li>Protector solar y gorra</li>
            <li>Abrigo (las noches en el NOA pueden ser frescas)</li>
            <li>Snack o vianda para el camino</li>
            <li>Documento de identidad</li>
          </ul>

          <p style="margin-top: 16px;"><strong>Importante:</strong> Llegar al punto de encuentro <strong>10 minutos antes</strong> del horario de salida.</p>

          <p style="margin-top: 24px;">
            <a href="https://wa.me/5493815825570" class="cta">Consultar por WhatsApp</a>
          </p>

          <p style="margin-top: 20px;">iNos vemos en el camino!</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <a href="https://mallku.com.ar">mallku.com.ar</a> &bull;
          <a href="https://instagram.com/mallku.noa">@mallku.noa</a> &bull;
          <a href="https://wa.me/5493815825570">WhatsApp</a>
          <p style="margin-top: 8px; color: #999;">San Miguel de Tucuman, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// CANCELLATION EMAIL TEMPLATE
// ==========================================

interface CancellationEmailParams {
  nombreCliente: string;
  excursionTitulo: string;
  fecha?: string;
}

export function getCancellationEmailHtml(params: CancellationEmailParams): string {
  const { nombreCliente, excursionTitulo, fecha } = params;

  const fechaStr = fecha
    ? new Date(fecha).toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { background: #f8f9fa; padding: 28px; }
        .highlight { background: white; border-left: 4px solid #c9a227; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
        .footer a { color: #c9a227; text-decoration: none; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 28px;
               text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mallku — Turismo Arqueologico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>Te informamos que tu reserva para la excursion <strong>${excursionTitulo}</strong>${fechaStr ? ` del ${fechaStr}` : ''} ha sido cancelada.</p>

          <p>Lamentamos los inconvenientes. Si tenes dudas o queres reagendar para otra fecha, no dudes en contactarnos:</p>

          <p>
            <a href="https://wa.me/5493815825570" class="cta">Consultar por WhatsApp</a>
          </p>

          <p style="margin-top: 20px;">Tambien podes ver nuestras fechas disponibles en <a href="https://mallku.com.ar/calendario" style="color:#c9a227;">mallku.com.ar/calendario</a> para elegir una nueva salida.</p>

          <p style="margin-top: 24px;">Esperamos poder acompanarte pronto.</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <a href="https://mallku.com.ar">mallku.com.ar</a> &bull;
          <a href="https://instagram.com/mallku.noa">@mallku.noa</a> &bull;
          <a href="https://wa.me/5493815825570">WhatsApp</a>
          <p style="margin-top: 8px; color: #999;">San Miguel de Tucuman, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// COMPLETION EMAIL TEMPLATE
// ==========================================

interface CompletionEmailParams {
  nombreCliente: string;
  excursionTitulo: string;
}

export function getCompletionEmailHtml(params: CompletionEmailParams): string {
  const { nombreCliente, excursionTitulo } = params;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { background: #f8f9fa; padding: 28px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
        .footer a { color: #c9a227; text-decoration: none; }
        .cta { display: inline-block; background: #c9a227; color: white; padding: 12px 28px;
               text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mallku — Turismo Arqueologico NOA</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>iGracias por elegirnos! Fue un placer haber compartido <strong>${excursionTitulo}</strong> con vos.</p>

          <p>Esperamos que hayas disfrutado la experiencia y que te hayas llevado un recuerdo inolvidable del NOA.</p>

          <p>Si tenes fotos del dia o queres contarnos como te fue, podes escribirnos por WhatsApp o Instagram. iNos encanta saber de ustedes!</p>

          <p style="margin-top: 20px;"><strong>iTu opinion nos ayuda mucho!</strong><br>
          Si tenes un minuto, te pedimos que nos dejes una reseña en Google Maps. Es la mejor forma de ayudarnos a crecer y que mas personas puedan conocer el NOA con nosotros:</p>

          <p>
            <a href="https://www.google.com/maps/place/Mallku+Excursiones+Arqueol%C3%B3gicas/@-26.8392521,-65.2217321,17z/data=!3m1!4b1!4m6!3m5!1s0x94225da72e1d27ad:0xcea1991ea737322a!8m2!3d-26.8392569!4d-65.2191572!16s%2Fg%2F11y_vzrm8t?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D" class="cta" style="background:#4285F4;">⭐ Dejar reseña en Google Maps</a>
          </p>

          <p style="margin-top: 24px;">
            <a href="https://mallku.com.ar/excursiones" style="color:#c9a227;">Ver mas excursiones</a>
          </p>

          <p style="margin-top: 20px;">iHasta la proxima aventura!</p>
          <p><strong>Equipo Mallku</strong></p>
        </div>
        <div class="footer">
          <a href="https://mallku.com.ar">mallku.com.ar</a> &bull;
          <a href="https://instagram.com/mallku.noa">@mallku.noa</a> &bull;
          <a href="https://wa.me/5493815825570">WhatsApp</a>
          <p style="margin-top: 8px; color: #999;">San Miguel de Tucuman, Argentina</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// GENERIC EMAIL FUNCTION
// ==========================================

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!resend) {
    console.error('Resend not initialized');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: options.from || 'Mallku <onboarding@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Error sending email:', JSON.stringify(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}

export async function sendEmailGetError(options: SendEmailOptions): Promise<string | null> {
  if (!resend) return 'Resend no inicializado (falta RESEND_API_KEY)';

  try {
    const { error } = await resend.emails.send({
      from: options.from || 'Mallku <onboarding@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      const resendError = error as any;
      return resendError?.message || JSON.stringify(error);
    }

    return null; // null = éxito
  } catch (err: any) {
    return err?.message || String(err);
  }
}
