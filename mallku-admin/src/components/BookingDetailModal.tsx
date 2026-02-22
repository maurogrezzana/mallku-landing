import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reservasApi, alertasApi } from '@/lib/api';
import type { Booking } from '@/types';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailModal({ booking, isOpen, onClose }: BookingDetailModalProps) {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [seniaPagada, setSeniaPagada] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [notasInternas, setNotasInternas] = useState('');
  const [mpLinkUrl, setMpLinkUrl] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<'confirmation' | 'balance' | 'info'>('confirmation');
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setPaymentStatus(booking.paymentStatus);
      setSeniaPagada(booking.seniaPagada ? String(booking.seniaPagada / 100) : '');
      setPaymentReference(booking.paymentReference || '');
      setNotasInternas(booking.notasInternas || '');
      setMpLinkUrl(null);
      setCopied(false);
      setEmailSent(false);
      setEmailTemplate('confirmation');
    }
  }, [booking]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      const previousStatus = booking.status;

      await reservasApi.updateStatus(
        booking.id,
        isPaid
          ? { notasInternas: notasInternas || undefined }
          : {
              status: status as any,
              paymentStatus: paymentStatus as any,
              seniaPagada: seniaPagada ? Math.round(parseFloat(seniaPagada) * 100) : undefined,
              paymentReference: paymentReference || undefined,
              notasInternas: notasInternas || undefined,
            }
      );

      // Auto-enviar email de confirmación si el status pasó a "confirmed"
      if (status === 'confirmed' && previousStatus !== 'confirmed') {
        try {
          await alertasApi.sendBookingEmail(booking.id, 'confirmation');
        } catch {
          // Email no crítico — no bloquear el guardado
        }
      }

      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateMpLink = async () => {
    if (!booking) return;
    setGeneratingLink(true);
    try {
      const result = await reservasApi.generatePaymentLink(booking.bookingNumber);
      setMpLinkUrl(result.init_point);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al generar link de MercadoPago');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleSendEmail = async () => {
    if (!booking) return;
    setEmailSending(true);
    try {
      await alertasApi.sendBookingEmail(booking.id, emailTemplate);
      setEmailSent(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al enviar email');
    } finally {
      setEmailSending(false);
    }
  };

  const handleCopyLink = () => {
    if (!mpLinkUrl) return;
    navigator.clipboard.writeText(mpLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrecio = (centavos: number | null) => {
    if (!centavos) return '-';
    return `$${(centavos / 100).toLocaleString('es-AR')}`;
  };

  if (!booking) return null;

  const isPaid = booking.paymentStatus === 'paid';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            Reserva{' '}
            <span className="font-mono text-sm text-muted-foreground">
              {booking.bookingNumber}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sección 1: Info cliente (readonly) */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Datos del cliente
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{booking.nombreCompleto}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{booking.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <p className="font-medium">{booking.telefono}</p>
              </div>
              {booking.dni && (
                <div>
                  <span className="text-muted-foreground">DNI:</span>
                  <p className="font-medium">{booking.dni}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Excursión:</span>
                <p className="font-medium">{booking.excursionTitulo || '-'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <p className="font-medium">
                  {booking.tipo === 'personalizada'
                    ? formatFecha(booking.fechaPropuesta)
                    : formatFecha(booking.fecha)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Personas:</span>
                <p className="font-medium">{booking.cantidadPersonas} pax</p>
              </div>
              <div>
                <span className="text-muted-foreground">Precio total:</span>
                <p className="font-medium">{formatPrecio(booking.precioTotal)}</p>
              </div>
              {booking.notasCliente && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Nota del cliente:</span>
                  <p className="font-medium">{booking.notasCliente}</p>
                </div>
              )}
            </div>
          </div>

          <hr />

          {/* Sección 2: Estado de la reserva */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Estado de la reserva
            </h3>
            {isPaid ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Pagada
                </span>
                <span className="text-xs text-muted-foreground">— No se puede modificar una reserva completamente abonada</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="paid">Pagada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            )}
          </div>

          <hr />

          {/* Sección 3: Pago */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Información de pago
            </h3>
            {isPaid ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Estado de pago:</span>
                  <p className="font-medium mt-0.5">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Pago completo
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monto abonado:</span>
                  <p className="font-medium mt-0.5">{seniaPagada ? `$${parseFloat(seniaPagada).toLocaleString('es-AR')}` : formatPrecio(booking.precioTotal)}</p>
                </div>
                {paymentReference && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Referencia:</span>
                    <p className="font-medium font-mono text-xs mt-0.5">{paymentReference}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Estado de pago</Label>
                  <select
                    id="paymentStatus"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="pending">Sin pago</option>
                    <option value="partial">Seña / Pago parcial</option>
                    <option value="paid">Pago completo</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seniaPagada">Seña / Pago ($ARS)</Label>
                    <Input
                      id="seniaPagada"
                      type="number"
                      placeholder="0.00"
                      value={seniaPagada}
                      onChange={(e) => setSeniaPagada(e.target.value)}
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentReference">Referencia de pago</Label>
                    <Input
                      id="paymentReference"
                      placeholder="Ej: MP-TXN-123, Transferencia Banco X"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                    />
                  </div>
                </div>

                {/* Botón MercadoPago */}
                <div className="space-y-2 pt-1">
                  <Label>Link de pago MercadoPago</Label>
                  {!mpLinkUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateMpLink}
                      disabled={generatingLink}
                    >
                      {generatingLink ? 'Generando...' : '🔗 Generar link de pago MP'}
                    </Button>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={mpLinkUrl}
                        readOnly
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCopyLink}
                      >
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </Button>
                    </div>
                  )}
                  {mpLinkUrl && (
                    <p className="text-xs text-muted-foreground">
                      Enviá este link al cliente por WhatsApp para que pague online con tarjeta, débito o transferencia.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <hr />

          {/* Sección 4: Notas internas */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Notas internas
            </h3>
            <div className="space-y-2">
              <Label htmlFor="notasInternas">Solo visible para el admin</Label>
              <textarea
                id="notasInternas"
                value={notasInternas}
                onChange={(e) => setNotasInternas(e.target.value)}
                placeholder="Ej: Pago confirmado por transferencia, esperar foto de comprobante..."
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <hr />

          {/* Sección 5: Enviar email al cliente */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Enviar email al cliente
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={emailTemplate}
                onChange={(e) => {
                  setEmailTemplate(e.target.value as 'confirmation' | 'balance' | 'info');
                  setEmailSent(false);
                }}
                className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={emailSending}
              >
                <option value="confirmation">Confirmación de reserva</option>
                <option value="balance">Recordatorio de saldo pendiente</option>
                <option value="info">Información de la excursión</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendEmail}
                disabled={emailSending || emailSent}
                className="shrink-0"
              >
                {emailSent ? '✓ Enviado' : emailSending ? 'Enviando...' : 'Enviar email'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Se enviará a: {booking.email}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
