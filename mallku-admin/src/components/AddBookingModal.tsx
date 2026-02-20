import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { excursionesApi, fechasApi, reservasApi } from '@/lib/api';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookingModal({ isOpen, onClose }: AddBookingModalProps) {
  const queryClient = useQueryClient();

  const [tipo, setTipo] = useState<'fecha-fija' | 'personalizada'>('fecha-fija');
  const [excursionId, setExcursionId] = useState('');
  const [dateId, setDateId] = useState('');
  const [fechaPropuesta, setFechaPropuesta] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [precioTotal, setPrecioTotal] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [seniaPagada, setSeniaPagada] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [notasInternas, setNotasInternas] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  // Cargar excursiones
  const { data: excursiones = [] } = useQuery({
    queryKey: ['excursiones-admin'],
    queryFn: () => excursionesApi.getAll(),
    enabled: isOpen,
  });

  // Cargar fechas disponibles según excursión seleccionada
  const selectedExcursion = excursiones.find((e) => e.id === excursionId);
  const { data: fechasDisponibles = [] } = useQuery({
    queryKey: ['fechas-by-excursion', selectedExcursion?.slug],
    queryFn: () => fechasApi.getByExcursion(selectedExcursion!.slug),
    enabled: !!selectedExcursion && tipo === 'fecha-fija',
  });

  // Auto-calcular precio cuando cambia la fecha o personas
  useEffect(() => {
    if (tipo === 'fecha-fija' && dateId && fechasDisponibles.length > 0) {
      const fecha = fechasDisponibles.find((f) => f.id === dateId);
      if (fecha) {
        const precioBase = fecha.precioOverride || fecha.precioBase || 0;
        setPrecioTotal(String(Math.round((precioBase * cantidadPersonas) / 100)));
      }
    } else if (tipo === 'personalizada' && selectedExcursion) {
      const precioBase = selectedExcursion.precioBase || 0;
      setPrecioTotal(String(Math.round((precioBase * cantidadPersonas) / 100)));
    }
  }, [dateId, cantidadPersonas, tipo, selectedExcursion, fechasDisponibles]);

  const resetForm = () => {
    setTipo('fecha-fija');
    setExcursionId('');
    setDateId('');
    setFechaPropuesta('');
    setNombreCompleto('');
    setEmail('');
    setTelefono('');
    setDni('');
    setCantidadPersonas(1);
    setPrecioTotal('');
    setStatus('confirmed');
    setPaymentStatus('pending');
    setSeniaPagada('');
    setPaymentReference('');
    setNotasInternas('');
    setSendEmail(false);
  };

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof reservasApi.createManual>[0]) =>
      reservasApi.createManual(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      resetForm();
      onClose();
    },
  });

  const handleSubmit = async () => {
    if (!excursionId) return alert('Seleccioná una excursión');
    if (!nombreCompleto || !email || !telefono) return alert('Completá nombre, email y teléfono');
    if (tipo === 'fecha-fija' && !dateId) return alert('Seleccioná una fecha del calendario');
    if (tipo === 'personalizada' && !fechaPropuesta) return alert('Ingresá una fecha propuesta');

    try {
      await createMutation.mutateAsync({
        tipo,
        excursionId,
        dateId: tipo === 'fecha-fija' ? dateId : undefined,
        fechaPropuesta: tipo === 'personalizada' ? new Date(fechaPropuesta).toISOString() : undefined,
        nombreCompleto,
        email,
        telefono,
        dni: dni || undefined,
        cantidadPersonas,
        precioTotal: precioTotal ? Math.round(parseFloat(precioTotal) * 100) : undefined,
        status: status as any,
        paymentStatus: paymentStatus as any,
        seniaPagada: seniaPagada ? Math.round(parseFloat(seniaPagada) * 100) : undefined,
        paymentReference: paymentReference || undefined,
        notasInternas: notasInternas || undefined,
        sendEmail,
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear la reserva');
    }
  };

  const selectedDate = fechasDisponibles.find((f) => f.id === dateId);
  const cuposDisponibles = selectedDate
    ? selectedDate.cuposTotales - selectedDate.cuposReservados
    : null;

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Reserva Manual</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Excursión */}
          <div className="space-y-2">
            <Label htmlFor="excursionId">Excursión *</Label>
            <select
              id="excursionId"
              value={excursionId}
              onChange={(e) => {
                setExcursionId(e.target.value);
                setDateId('');
              }}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Seleccioná una excursión</option>
              {excursiones.map((exc) => (
                <option key={exc.id} value={exc.id}>
                  {exc.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Modalidad *</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  value="fecha-fija"
                  checked={tipo === 'fecha-fija'}
                  onChange={() => setTipo('fecha-fija')}
                />
                Fecha del calendario
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  value="personalizada"
                  checked={tipo === 'personalizada'}
                  onChange={() => setTipo('personalizada')}
                />
                Fecha personalizada
              </label>
            </div>
          </div>

          {/* Fecha según tipo */}
          {tipo === 'fecha-fija' && (
            <div className="space-y-2">
              <Label htmlFor="dateId">Fecha del calendario *</Label>
              <select
                id="dateId"
                value={dateId}
                onChange={(e) => setDateId(e.target.value)}
                disabled={!excursionId}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              >
                <option value="">
                  {excursionId ? 'Seleccioná una fecha' : 'Primero elegí una excursión'}
                </option>
                {fechasDisponibles
                  .filter((f) => f.estado !== 'cancelado')
                  .map((f) => {
                    const disponibles = f.cuposTotales - f.cuposReservados;
                    return (
                      <option key={f.id} value={f.id} disabled={disponibles === 0}>
                        {formatFecha(f.fecha)} — {disponibles} cupos libres
                        {f.precioOverride ? ` — $${(f.precioOverride / 100).toLocaleString('es-AR')}` : ''}
                      </option>
                    );
                  })}
              </select>
              {cuposDisponibles !== null && (
                <p className="text-xs text-muted-foreground">
                  {cuposDisponibles} cupos disponibles en esta fecha
                </p>
              )}
            </div>
          )}

          {tipo === 'personalizada' && (
            <div className="space-y-2">
              <Label htmlFor="fechaPropuesta">Fecha de la excursión *</Label>
              <Input
                id="fechaPropuesta"
                type="date"
                value={fechaPropuesta}
                onChange={(e) => setFechaPropuesta(e.target.value)}
              />
            </div>
          )}

          <hr />

          {/* Datos del cliente */}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Datos del cliente
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombreCompleto">Nombre completo *</Label>
              <Input
                id="nombreCompleto"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 381 xxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI (opcional)</Label>
              <Input
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidadPersonas">Personas *</Label>
              <Input
                id="cantidadPersonas"
                type="number"
                min={1}
                max={cuposDisponibles || 30}
                value={cantidadPersonas}
                onChange={(e) => setCantidadPersonas(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <hr />

          {/* Estado y pago */}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Estado y pago
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado inicial</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagada</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Estado de pago</Label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="pending">Sin pago</option>
                <option value="partial">Seña / Parcial</option>
                <option value="paid">Pago completo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioTotal">Precio total ($ARS)</Label>
              <Input
                id="precioTotal"
                type="number"
                value={precioTotal}
                onChange={(e) => setPrecioTotal(e.target.value)}
                placeholder="Auto-calculado"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seniaPagada">Seña cobrada ($ARS)</Label>
              <Input
                id="seniaPagada"
                type="number"
                value={seniaPagada}
                onChange={(e) => setSeniaPagada(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="paymentReference">Referencia de pago</Label>
              <Input
                id="paymentReference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Ej: Transferencia Banco X, MP-TXN-123..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notasInternas">Notas internas</Label>
            <textarea
              id="notasInternas"
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
              placeholder="Reserva ingresada por WhatsApp, cliente contactado por Instagram..."
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            Enviar email de confirmación al cliente
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creando...' : 'Crear reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
