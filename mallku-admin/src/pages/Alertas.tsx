import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { alertasApi } from '@/lib/api';
import { Bell, Mail, Users } from 'lucide-react';
import type { UpcomingDate } from '@/types';

function getUrgencyInfo(fecha: string): {
  label: string;
  borderClass: string;
  badgeClass: string;
  daysUntil: number;
} {
  const now = new Date();
  const fechaDate = new Date(fecha);
  const diffMs = fechaDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysUntil <= 1) {
    return {
      label: 'URGENTE',
      borderClass: 'border-l-4 border-l-red-500',
      badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
      daysUntil,
    };
  } else if (daysUntil <= 3) {
    return {
      label: 'PRÓXIMO',
      borderClass: 'border-l-4 border-l-orange-400',
      badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
      daysUntil,
    };
  } else {
    return {
      label: 'ESTA SEMANA',
      borderClass: 'border-l-4 border-l-green-500',
      badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      daysUntil,
    };
  }
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function paymentBadge(status: string) {
  if (status === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
  if (status === 'partial') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
}

function paymentLabel(status: string) {
  if (status === 'paid') return 'Pago completo';
  if (status === 'partial') return 'Seña';
  return 'Sin pago';
}

function DateCard({ item }: { item: UpcomingDate }) {
  const [reminderSent, setReminderSent] = useState(false);
  const urgency = getUrgencyInfo(item.date.fecha);

  const reminderMutation = useMutation({
    mutationFn: () => alertasApi.sendReminder(item.date.id),
    onSuccess: (data) => {
      alert(
        `Recordatorio enviado a ${data.sent} de ${data.total} clientes.` +
          (data.errors.length > 0 ? `\nErrores: ${data.errors.join(', ')}` : '')
      );
      setReminderSent(true);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al enviar recordatorios');
    },
  });

  const totalPax = item.bookings.reduce((acc, b) => acc + b.cantidadPersonas, 0);

  return (
    <Card className={`${urgency.borderClass} shadow-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${urgency.badgeClass}`}
              >
                {urgency.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {urgency.daysUntil === 0
                  ? 'Hoy'
                  : urgency.daysUntil === 1
                  ? 'Mañana'
                  : `En ${urgency.daysUntil} días`}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{item.excursion.titulo || 'Excursión'}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatFecha(item.date.fecha)}
              {item.date.horaSalida && ` · ${item.date.horaSalida} hs`}
              {' · '}
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                {totalPax} pax confirmados
              </span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => reminderMutation.mutate()}
            disabled={reminderMutation.isPending || reminderSent || item.bookings.length === 0}
            className="shrink-0"
          >
            <Mail className="w-4 h-4 mr-2" />
            {reminderSent
              ? 'Enviado'
              : reminderMutation.isPending
              ? 'Enviando...'
              : 'Enviar recordatorio'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {item.bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No hay clientes confirmados para esta fecha.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.nombreCompleto}</TableCell>
                  <TableCell>
                    <a
                      href={`https://wa.me/${booking.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {booking.telefono}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.email}</TableCell>
                  <TableCell>{booking.cantidadPersonas}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${paymentBadge(booking.paymentStatus)}`}
                    >
                      {paymentLabel(booking.paymentStatus)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {item.date.notas && (
          <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
            <span className="font-medium">Punto de encuentro / Notas:</span> {item.date.notas}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function AlertasPage() {
  const { data: upcoming = [], isLoading, error } = useQuery({
    queryKey: ['alertas-upcoming'],
    queryFn: () => alertasApi.getUpcoming(7),
    refetchInterval: 5 * 60 * 1000, // Refresh cada 5 minutos
  });

  const urgentes = upcoming.filter((item) => {
    const days = Math.ceil(
      (new Date(item.date.fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
            {urgentes.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                {urgentes.length}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">Próximas salidas en los siguientes 7 días</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="w-4 h-4" />
          <span>Los recordatorios se envían automáticamente 48hs antes</span>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Cargando próximas salidas...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">Error al cargar. Intentá refrescar la página.</p>
      )}

      {!isLoading && !error && upcoming.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No hay salidas programadas en los próximos 7 días.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {upcoming.map((item) => (
          <DateCard key={item.date.id} item={item} />
        ))}
      </div>
    </div>
  );
}
