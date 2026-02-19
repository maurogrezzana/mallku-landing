import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { excursionesApi } from '@/lib/api';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function ExcursionesPage() {
  const queryClient = useQueryClient();

  // Fetch excursiones
  const { data: excursiones, isLoading } = useQuery({
    queryKey: ['excursiones'],
    queryFn: excursionesApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: excursionesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['excursiones'] });
    },
  });

  const handleDelete = async (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const formatPrecio = (centavos: number) => {
    return `$${(centavos / 100).toLocaleString('es-AR')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Excursiones</h1>
          <p className="text-muted-foreground">Gestión de excursiones</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Excursión
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Excursiones</CardTitle>
          <CardDescription>
            {excursiones?.length || 0} excursión(es) en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : excursiones && excursiones.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio Base</TableHead>
                  <TableHead>Grupo Máx</TableHead>
                  <TableHead>Dificultad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {excursiones.map((excursion) => (
                  <TableRow key={excursion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{excursion.titulo}</p>
                        <p className="text-sm text-muted-foreground">{excursion.subtitulo}</p>
                      </div>
                    </TableCell>
                    <TableCell>{excursion.duracion}</TableCell>
                    <TableCell>{formatPrecio(excursion.precioBase)}</TableCell>
                    <TableCell>{excursion.grupoMax} pax</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          excursion.dificultad === 'baja'
                            ? 'bg-green-50 text-green-700'
                            : excursion.dificultad === 'media'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {excursion.dificultad}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          excursion.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {excursion.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(excursion.id, excursion.titulo)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No hay excursiones creadas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
