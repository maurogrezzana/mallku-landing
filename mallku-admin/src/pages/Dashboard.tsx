import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vista general del sistema de reservas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Excursiones Activas</CardDescription>
            <CardTitle className="text-4xl">2</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Fechas Publicadas</CardDescription>
            <CardTitle className="text-4xl">12</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Reservas Totales</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Propuestas Pendientes</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas fechas</CardTitle>
          <CardDescription>Fechas con cupos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cargando datos desde la API...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
