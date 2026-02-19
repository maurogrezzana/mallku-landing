import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fechasApi, excursionesApi } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Date as FechaSalida, CreateDateInput } from '@/types';

// ==========================================
// HELPERS
// ==========================================

function formatFecha(fechaStr: string) {
  return new window.Date(fechaStr).toLocaleDateString('es-AR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPrecio(centavos: number | null | undefined) {
  if (!centavos) return null;
  return `$${(centavos / 100).toLocaleString('es-AR')}`;
}

function toISODate(fechaStr: string) {
  return new window.Date(fechaStr + 'T12:00:00.000Z').toISOString();
}

function toInputDate(isoStr: string) {
  return isoStr.slice(0, 10);
}

function EstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    disponible: 'bg-green-50 text-green-700',
    'pocos-cupos': 'bg-orange-50 text-orange-700',
    completo: 'bg-red-50 text-red-700',
    cancelado: 'bg-gray-100 text-gray-500',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles[estado] || 'bg-gray-100 text-gray-600'}`}
    >
      {estado}
    </span>
  );
}

// ==========================================
// FORM DIALOG
// ==========================================

const emptyForm = {
  excursionId: '',
  fecha: '',
  horaSalida: '08:00',
  cuposTotales: 8,
  precioOverride: '' as string | number,
  notas: '',
};

interface FechaFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: FechaSalida | null;
  excursiones: { id: string; titulo: string }[];
  onSubmit: (data: CreateDateInput) => Promise<void>;
  isSubmitting: boolean;
}

function FechaFormDialog({
  open,
  onClose,
  initialData,
  excursiones,
  onSubmit,
  isSubmitting,
}: FechaFormDialogProps) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          excursionId: initialData.excursionId,
          fecha: toInputDate(initialData.fecha),
          horaSalida: initialData.horaSalida || '08:00',
          cuposTotales: initialData.cuposTotales,
          precioOverride: initialData.precioOverride
            ? String(initialData.precioOverride / 100)
            : '',
          notas: initialData.notas || '',
        }
      : { ...emptyForm }
  );
  const [error, setError] = useState('');

  const set = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setError('');
      setForm(
        initialData
          ? {
              excursionId: initialData.excursionId,
              fecha: toInputDate(initialData.fecha),
              horaSalida: initialData.horaSalida || '08:00',
              cuposTotales: initialData.cuposTotales,
              precioOverride: initialData.precioOverride
                ? String(initialData.precioOverride / 100)
                : '',
              notas: initialData.notas || '',
            }
          : { ...emptyForm }
      );
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.excursionId) return setError('Seleccioná una excursión');
    if (!form.fecha) return setError('La fecha es requerida');

    try {
      await onSubmit({
        excursionId: form.excursionId,
        fecha: toISODate(form.fecha),
        horaSalida: form.horaSalida,
        cuposTotales: Number(form.cuposTotales),
        precioOverride: form.precioOverride !== '' ? Number(form.precioOverride) * 100 : undefined,
        notas: form.notas || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Fecha' : 'Nueva Fecha de Salida'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Modificá los datos de esta fecha de salida.'
              : 'Agregá una nueva fecha al calendario público.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Excursión */}
          <div className="space-y-2">
            <Label htmlFor="excursionId">Excursión *</Label>
            <select
              id="excursionId"
              value={form.excursionId}
              onChange={(e) => set('excursionId', e.target.value)}
              required
              disabled={isSubmitting || !!initialData}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccioná una excursión</option>
              {excursiones.map((exc) => (
                <option key={exc.id} value={exc.id}>
                  {exc.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de salida *</Label>
            <Input
              id="fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => set('fecha', e.target.value)}
              required
              disabled={isSubmitting}
              min={new window.Date().toISOString().slice(0, 10)}
            />
          </div>

          {/* Hora + Cupos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaSalida">Hora de salida *</Label>
              <Input
                id="horaSalida"
                type="time"
                value={form.horaSalida}
                onChange={(e) => set('horaSalida', e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuposTotales">Cupos totales *</Label>
              <Input
                id="cuposTotales"
                type="number"
                min={1}
                max={30}
                value={form.cuposTotales}
                onChange={(e) => set('cuposTotales', parseInt(e.target.value) || 1)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Precio override */}
          <div className="space-y-2">
            <Label htmlFor="precioOverride">
              Precio especial{' '}
              <span className="text-xs text-muted-foreground font-normal">
                (vacío = usa precio base de la excursión)
              </span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="precioOverride"
                type="number"
                min={0}
                step={1000}
                className="pl-7"
                placeholder="ej: 150000"
                value={form.precioOverride}
                onChange={(e) => set('precioOverride', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">
              Notas internas{' '}
              <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="notas"
              type="text"
              placeholder="ej: Punto de encuentro en Terminal de Ómnibus"
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear fecha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// PAGE
// ==========================================

export function FechasPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingDate, setEditingDate] = useState<FechaSalida | null>(null);
  const [filterExcursion, setFilterExcursion] = useState('');

  // Queries
  const { data: fechas = [], isLoading: loadingFechas } = useQuery({
    queryKey: ['fechas'],
    queryFn: fechasApi.getAll,
  });

  const { data: excursiones = [], isLoading: loadingExc } = useQuery({
    queryKey: ['excursiones'],
    queryFn: excursionesApi.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: fechasApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fechas'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDateInput> }) =>
      fechasApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fechas'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: fechasApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fechas'] }),
  });

  const handleCancel = async (fecha: FechaSalida) => {
    const label = `${fecha.excursionTitulo} — ${formatFecha(fecha.fecha)}`;
    if (confirm(`¿Cancelar "${label}"? La fecha quedará marcada como cancelada.`)) {
      try {
        await deleteMutation.mutateAsync(fecha.id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error al cancelar');
      }
    }
  };

  // Filtered list
  const filtered = filterExcursion
    ? fechas.filter((f) => f.excursionId === filterExcursion)
    : fechas;

  const disponibles = fechas.filter((f) => f.estado === 'disponible').length;
  const pocosQupos = fechas.filter((f) => f.estado === 'pocos-cupos').length;
  const completas = fechas.filter((f) => f.estado === 'completo').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fechas</h1>
          <p className="text-muted-foreground">Gestión del calendario de salidas</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Fecha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">{disponibles}</div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-orange-600">{pocosQupos}</div>
            <p className="text-sm text-muted-foreground">Pocos cupos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-red-600">{completas}</div>
            <p className="text-sm text-muted-foreground">Completas</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todas las fechas</CardTitle>
              <CardDescription>
                {filtered.length} fecha(s)
                {filterExcursion ? ' filtradas' : ' en total'}
              </CardDescription>
            </div>
            <select
              value={filterExcursion}
              onChange={(e) => setFilterExcursion(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todas las excursiones</option>
              {excursiones.map((exc) => (
                <option key={exc.id} value={exc.id}>
                  {exc.titulo}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingFechas || loadingExc ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Excursión</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cupos</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((fecha) => {
                  const disponibles =
                    fecha.cuposDisponibles ?? fecha.cuposTotales - fecha.cuposReservados;
                  return (
                    <TableRow
                      key={fecha.id}
                      className={fecha.estado === 'cancelado' ? 'opacity-50' : ''}
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatFecha(fecha.fecha)}
                      </TableCell>
                      <TableCell className="text-sm">{fecha.excursionTitulo}</TableCell>
                      <TableCell>{fecha.horaSalida}</TableCell>
                      <TableCell>
                        <span
                          className={`text-sm font-medium ${disponibles === 0 ? 'text-red-600' : 'text-green-700'}`}
                        >
                          {disponibles}/{fecha.cuposTotales}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatPrecio(fecha.precioOverride) || (
                          <span className="text-xs text-muted-foreground">
                            {formatPrecio(fecha.precioBase) ?? 'base'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <EstadoBadge estado={fecha.estado} />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {fecha.notas || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDate(fecha)}
                            disabled={fecha.estado === 'cancelado'}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancel(fecha)}
                            disabled={fecha.estado === 'cancelado' || deleteMutation.isPending}
                            title="Cancelar fecha"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground mb-4">
                {filterExcursion
                  ? 'No hay fechas para esta excursión'
                  : 'Todavía no hay fechas publicadas'}
              </p>
              <Button variant="outline" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar primera fecha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FechaFormDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        excursiones={excursiones}
        onSubmit={(data) => createMutation.mutateAsync(data)}
        isSubmitting={createMutation.isPending}
      />

      <FechaFormDialog
        open={!!editingDate}
        onClose={() => setEditingDate(null)}
        initialData={editingDate}
        excursiones={excursiones}
        onSubmit={(data) => updateMutation.mutateAsync({ id: editingDate!.id, data })}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
