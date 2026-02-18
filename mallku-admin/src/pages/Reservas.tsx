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
import { Check, X } from 'lucide-react';
import type { Booking } from '@/types';

export function ReservasPage() {
  const queryClient = useQueryClient();

  // Fetch reservas fecha-fija
  const { data: fechaFijaData, isLoading: loadingFija } = useQuery({
    queryKey: ['reservas', 'fecha-fija'],
    queryFn: () => reservasApi.getAll({ tipo: 'fecha-fija', limit: 50 }),
  });

  // Fetch propuestas personalizadas pendientes
  const { data: propuestasData, isLoading: loadingProp } = useQuery({
    queryKey: ['reservas', 'personalizada', 'pendiente'],
    queryFn: () =>
      reservasApi.getAll({
        tipo: 'personalizada',
        estadoPropuesta: 'pendiente',
        limit: 50,
      }),
  });

  // Aprobar mutation
  const aprobarMutation = useMutation({
    mutationFn: async ({ id, dateId }: { id: string; dateId: string }) =>
      reservasApi.reviewPropuesta(id, { estadoPropuesta: 'aprobada', dateId }),
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
    const dateId = prompt(
      `Para aprobar "${booking.nombreCompleto}", ingresa el ID de la fecha a asignar:`
    );
    if (dateId) {
      try {
        await aprobarMutation.mutateAsync({ id: booking.id, dateId });
        alert('Propuesta aprobada exitosamente');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error al aprobar');
      }
    }
  };

  const handleRechazar = async (booking: Booking) => {
    const motivo = prompt(`Motivo de rechazo para "${booking.nombreCompleto}":`);
    if (motivo) {
      try {
        await rechazarMutation.mutateAsync({ id: booking.id, motivo });
        alert('Propuesta rechazada');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error al rechazar');
      }
    }
  };

  const formatPrecio = (centavos: number | null) => {
    if (!centavos) return '-';
    return `$${(centavos / 100).toLocaleString('es-AR')}`;
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground">Gestión de reservas y propuestas</p>
      </div>

      <Tabs defaultValue="fecha-fija" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fecha-fija">
            Fecha Fija ({fechaFijaData?.pagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="propuestas">
            Propuestas Pendientes ({propuestasData?.pagination.total || 0})
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
                        <TableCell>{formatFecha(booking.fecha || null)}</TableCell>
                        <TableCell>{booking.cantidadPersonas}</TableCell>
                        <TableCell>{formatPrecio(booking.precioTotal)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-50 text-green-700'
                                : booking.status === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : booking.status === 'completed'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {booking.status}
                          </span>
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

        {/* Tab: Propuestas Personalizadas */}
        <TabsContent value="propuestas">
          <Card>
            <CardContent className="pt-6">
              {loadingProp ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : propuestasData && propuestasData.data.length > 0 ? (
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
                    {propuestasData.data.map((booking) => (
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
      </Tabs>
    </div>
  );
}
