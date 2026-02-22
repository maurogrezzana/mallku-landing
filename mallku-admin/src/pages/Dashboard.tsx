import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { excursionesApi, fechasApi, reservasApi } from '@/lib/api';
import { Calendar, MapPin, FileText, Clock } from 'lucide-react';

export function DashboardPage() {
  // Fetch data
  const { data: excursiones, isLoading: loadingExc } = useQuery({
    queryKey: ['excursiones'],
    queryFn: excursionesApi.getAll,
  });

  const { data: fechas, isLoading: loadingFechas } = useQuery({
    queryKey: ['fechas'],
    queryFn: fechasApi.getAll,
  });

  const { data: reservasData, isLoading: loadingReservas } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => reservasApi.getAll({ limit: 100 }),
  });

  // Calculate stats
  const excursionesActivas = excursiones?.filter((e) => e.isActive).length || 0;
  const totalFechas = fechas?.length || 0;
  const totalReservas = reservasData?.pagination.total || 0;
  const propuestasPendientes =
    reservasData?.data.filter(
      (r) => r.tipo === 'personalizada' && r.estadoPropuesta === 'pendiente'
    ).length || 0;

  // Próximas fechas (futuras, ordenadas por fecha)
  const now = new Date();
  const proximasFechas = fechas
    ?.filter((f) => new Date(f.fecha) >= now && f.estado !== 'completo')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  const isLoading = loadingExc || loadingFechas || loadingReservas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vista general del sistema de reservas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excursiones Activas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : excursionesActivas}</div>
            <p className="text-xs text-muted-foreground">
              {excursiones?.length || 0} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechas Publicadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalFechas}</div>
            <p className="text-xs text-muted-foreground">
              {proximasFechas?.length || 0} próximas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalReservas}</div>
            <p className="text-xs text-muted-foreground">Todas las reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propuestas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : propuestasPendientes}
            </div>
            <p className="text-xs text-muted-foreground">Requieren revisión</p>
          </CardContent>
        </Card>
      </div>

      {/* Próximas fechas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas fechas</CardTitle>
          <CardDescription>Fechas con cupos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : proximasFechas && proximasFechas.length > 0 ? (
            <div className="space-y-3">
              {proximasFechas.map((fecha) => (
                <div
                  key={fecha.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{fecha.excursionTitulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(fecha.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      - {fecha.horaSalida}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {fecha.cuposDisponibles}/{fecha.cuposTotales} cupos
                    </p>
                    <p
                      className={`text-xs ${
                        fecha.estado === 'disponible'
                          ? 'text-green-600 dark:text-green-400'
                          : fecha.estado === 'pocos-cupos'
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {fecha.estado}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay fechas próximas publicadas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
