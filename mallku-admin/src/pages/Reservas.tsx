import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { reservasApi } from '@/lib/api';
import { Check, X, Eye, Plus } from 'lucide-react';
import type { Booking } from '@/types';
import { BookingDetailModal } from '@/components/BookingDetailModal';
import { AddBookingModal } from '@/components/AddBookingModal';

export function ReservasPage() {
  const queryClient = useQueryClient();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch reservas fecha-fija
  const { data: fechaFijaData, isLoading: loadingFija } = useQuery({
    queryKey: ['reservas', 'fecha-fija'],
    queryFn: () => reservasApi.getAll({ tipo: 'fecha-fija', limit: 50 }),
  });

  // Fetch TODAS las propuestas personalizadas (pendientes + revisadas)
  const { data: propuestasAllData, isLoading: loadingProp } = useQuery({
    queryKey: ['reservas', 'personalizada', 'all'],
    queryFn: () =>
      reservasApi.getAll({
        tipo: 'personalizada',
        limit: 100,
      }),
  });

  // Filtrar por estado en el cliente
  const propuestasPendientes = propuestasAllData?.data.filter(
    (b) => b.estadoPropuesta === 'pendiente'
  ) ?? [];
  const propuestasRevisadas = propuestasAllData?.data.filter(
    (b) => b.estadoPropuesta !== 'pendiente'
  ) ?? [];

  // Aprobar mutation
  const aprobarMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      reservasApi.reviewPropuesta(id, { estadoPropuesta: 'aprobada' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  // Rechazar mutation
  const rechazarMutation = useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo: string }) =>
      reservasApi.reviewPropuesta(id, { estadoPropuesta: 'rechazada', motivoRechazo: motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  const handleAprobar = async (booking: Booking) => {
    const ok = window.confirm(
      `¿Aprobar la propuesta de ${booking.nombreCompleto}?\n\nExcursión: ${booking.excursionTitulo}\nFecha propuesta: ${formatFecha(booking.fechaPropuesta)}\nPersonas: ${booking.cantidadPersonas}`
    );
    if (!ok) return;
    try {
      await aprobarMutation.mutateAsync({ id: booking.id });
      alert('Propuesta aprobada. Se envió email de confirmación al cliente.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleRechazar = async (booking: Booking) => {
    const motivo = prompt(`Motivo de rechazo para "${booking.nombreCompleto}":`);
    if (!motivo) return;
    try {
      await rechazarMutation.mutateAsync({ id: booking.id, motivo });
      alert('Propuesta rechazada. Se notificó al cliente.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al rechazar');
    }
  };

  const handleVerDetalle = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const formatPrecio = (centavos: number | null) => {
    if (!centavos) return '-';
    return `$${(centavos / 100).toLocaleString('es-AR')}`;
  };

  const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const estadoPropuestaBadge = (estado: string | null) => {
    if (estado === 'aprobada') return 'bg-green-50 text-green-700';
    if (estado === 'rechazada') return 'bg-red-50 text-red-700';
    return 'bg-yellow-50 text-yellow-700';
  };

  const statusBadge = (status: string) => {
    if (status === 'confirmed') return 'bg-green-50 text-green-700';
    if (status === 'pending') return 'bg-yellow-50 text-yellow-700';
    if (status === 'paid') return 'bg-blue-50 text-blue-700';
    if (status === 'completed') return 'bg-gray-50 text-gray-700';
    return 'bg-red-50 text-red-700';
  };

  const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    paid: 'Pagada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground">Gestión de reservas y propuestas</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      <Tabs defaultValue="fecha-fija" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fecha-fija">
            Fecha Fija ({fechaFijaData?.pagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="propuestas">
            Pendientes ({propuestasPendientes.length})
          </TabsTrigger>
          <TabsTrigger value="revisadas">
            Revisadas ({propuestasRevisadas.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Reservas Fecha Fija */}
        <TabsContent value="fecha-fija">
          <Card>
            <CardContent className="pt-6">
              {loadingFija ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : fechaFijaData && fechaFijaData.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Reserva</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Excursión</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Personas</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fechaFijaData.data.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.bookingNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.excursionTitulo}</TableCell>
                        <TableCell>{formatFecha(booking.fecha)}</TableCell>
                        <TableCell>{booking.cantidadPersonas}</TableCell>
                        <TableCell>{formatPrecio(booking.precioTotal)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadge(booking.status)}`}
                          >
                            {statusLabel[booking.status] || booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerDetalle(booking)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver / Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No hay reservas fecha-fija</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Propuestas Pendientes */}
        <TabsContent value="propuestas">
          <Card>
            <CardContent className="pt-6">
              {loadingProp ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : propuestasPendientes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Propuesta</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Excursión</TableHead>
                      <TableHead>Fecha Propuesta</TableHead>
                      <TableHead>Personas</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propuestasPendientes.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.bookingNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                            <p className="text-sm text-muted-foreground">{booking.telefono}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.excursionTitulo}</TableCell>
                        <TableCell>{formatFecha(booking.fechaPropuesta)}</TableCell>
                        <TableCell>{booking.cantidadPersonas} pax</TableCell>
                        <TableCell>
                          <p className="text-sm max-w-xs truncate">
                            {booking.notasCliente || '-'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAprobar(booking)}
                              disabled={
                                aprobarMutation.isPending || rechazarMutation.isPending
                              }
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRechazar(booking)}
                              disabled={
                                aprobarMutation.isPending || rechazarMutation.isPending
                              }
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay propuestas pendientes de revisión
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Propuestas Revisadas (aprobadas + rechazadas) */}
        <TabsContent value="revisadas">
          <Card>
            <CardContent className="pt-6">
              {loadingProp ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : propuestasRevisadas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Propuesta</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Excursión</TableHead>
                      <TableHead>Fecha Propuesta</TableHead>
                      <TableHead>Personas</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propuestasRevisadas.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.bookingNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.nombreCompleto}</p>
                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                            <p className="text-sm text-muted-foreground">{booking.telefono}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.excursionTitulo}</TableCell>
                        <TableCell>{formatFecha(booking.fechaPropuesta)}</TableCell>
                        <TableCell>{booking.cantidadPersonas} pax</TableCell>
                        <TableCell>{formatPrecio(booking.precioTotal)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${estadoPropuestaBadge(booking.estadoPropuesta)}`}
                          >
                            {booking.estadoPropuesta}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerDetalle(booking)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver / Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay propuestas revisadas aún
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooking(null);
        }}
      />
      <AddBookingModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
