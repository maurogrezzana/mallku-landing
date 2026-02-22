import { useState, useEffect, useRef } from 'react';
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
import { excursionesApi } from '@/lib/api';
import { uploadImage } from '@/lib/uploadImage';
import type { Excursion, ItinerarioItem } from '@/types';

interface ExcursionModalProps {
  excursion: Excursion | null;
  isOpen: boolean;
  onClose: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function ExcursionModal({ excursion, isOpen, onClose }: ExcursionModalProps) {
  const queryClient = useQueryClient();
  const isEditing = excursion !== null;

  // Datos básicos
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [subtitulo, setSubtitulo] = useState('');
  const [tag, setTag] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [salida, setSalida] = useState('');
  const [dificultad, setDificultad] = useState<'baja' | 'media' | 'alta' | ''>('');
  const [grupoMax, setGrupoMax] = useState('');
  const [mejorEpoca, setMejorEpoca] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  const [precio, setPrecio] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  // Arrays dinámicos
  const [descripcionLarga, setDescripcionLarga] = useState<string[]>(['']);
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [galeria, setGaleria] = useState<string[]>(['']);
  const [itinerario, setItinerario] = useState<ItinerarioItem[]>([{ hora: '', actividad: '', descripcion: '' }]);
  const [incluye, setIncluye] = useState<string[]>(['']);
  const [noIncluye, setNoIncluye] = useState<string[]>(['']);
  const [recomendaciones, setRecomendaciones] = useState<string[]>(['']);

  // Config
  const [isActive, setIsActive] = useState(true);
  const [orden, setOrden] = useState('0');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Estado de upload de imágenes
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadTarget = useRef<{
    field: 'principal' | 'galeria';
    index?: number;
  } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingUploadTarget.current) return;
    e.target.value = '';

    const target = pendingUploadTarget.current;
    const fieldKey = target.field === 'galeria' ? `galeria-${target.index}` : 'principal';
    setUploadingField(fieldKey);

    try {
      const token = localStorage.getItem('token') || '';
      const url = await uploadImage(file, token, (state) => {
        setUploadingField(state === 'resizing' ? `${fieldKey}-resizing` : fieldKey);
      });

      if (target.field === 'principal') {
        setImagenPrincipal(url);
      } else if (target.field === 'galeria' && target.index !== undefined) {
        const next = [...galeria];
        next[target.index] = url;
        setGaleria(next);
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploadingField(null);
      pendingUploadTarget.current = null;
    }
  };

  const triggerUpload = (field: 'principal' | 'galeria', index?: number) => {
    pendingUploadTarget.current = { field, index };
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (isOpen) {
      if (excursion) {
        setTitulo(excursion.titulo);
        setSlug(excursion.slug);
        setSlugManual(true);
        setSubtitulo(excursion.subtitulo || '');
        setTag(excursion.tag || '');
        setDescripcion(excursion.descripcion || '');
        setDuracion(excursion.duracion || '');
        setSalida(excursion.salida || '');
        setDificultad(excursion.dificultad || '');
        setGrupoMax(excursion.grupoMax ? String(excursion.grupoMax) : '');
        setMejorEpoca(excursion.mejorEpoca || '');
        setPrecioBase(excursion.precioBase ? String(Math.round(excursion.precioBase / 100)) : '');
        setPrecio(excursion.precio || '');
        setPriceNote(excursion.priceNote || '');
        setWhatsappLink(excursion.whatsappLink || '');
        setDescripcionLarga(excursion.descripcionLarga?.length ? excursion.descripcionLarga : ['']);
        setHighlights(excursion.highlights?.length ? excursion.highlights : ['']);
        setImagenPrincipal(excursion.imagenPrincipal || '');
        setGaleria(excursion.galeria?.length ? excursion.galeria : ['']);
        setItinerario(excursion.itinerario?.length ? excursion.itinerario : [{ hora: '', actividad: '', descripcion: '' }]);
        setIncluye(excursion.incluye?.length ? excursion.incluye : ['']);
        setNoIncluye(excursion.noIncluye?.length ? excursion.noIncluye : ['']);
        setRecomendaciones(excursion.recomendaciones?.length ? excursion.recomendaciones : ['']);
        setIsActive(excursion.isActive);
        setOrden(String(excursion.orden ?? 0));
      } else {
        // Reset for creation
        setTitulo('');
        setSlug('');
        setSlugManual(false);
        setSubtitulo('');
        setTag('');
        setDescripcion('');
        setDuracion('');
        setSalida('');
        setDificultad('');
        setGrupoMax('');
        setMejorEpoca('');
        setPrecioBase('');
        setPrecio('');
        setPriceNote('');
        setWhatsappLink('');
        setDescripcionLarga(['']);
        setHighlights(['']);
        setImagenPrincipal('');
        setGaleria(['']);
        setItinerario([{ hora: '', actividad: '', descripcion: '' }]);
        setIncluye(['']);
        setNoIncluye(['']);
        setRecomendaciones(['']);
        setIsActive(true);
        setOrden('0');
      }
      setError('');
    }
  }, [isOpen, excursion]);

  const handleTituloChange = (value: string) => {
    setTitulo(value);
    if (!slugManual && !isEditing) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    if (!titulo) return setError('El título es requerido');
    if (!slug) return setError('El slug es requerido');
    if (!grupoMax) return setError('El grupo máximo es requerido');

    setSaving(true);
    setError('');

    const cleanArray = (arr: string[]) => arr.filter((s) => s.trim() !== '');
    const cleanItinerario = (items: ItinerarioItem[]) =>
      items.filter((i) => i.hora.trim() || i.actividad.trim());

    const payload: any = {
      titulo,
      slug,
      subtitulo: subtitulo || undefined,
      tag: tag || undefined,
      descripcion: descripcion || 'Próximamente',
      duracion: duracion || undefined,
      salida: salida || undefined,
      dificultad: dificultad || undefined,
      grupoMax: parseInt(grupoMax),
      mejorEpoca: mejorEpoca || undefined,
      precioBase: precioBase ? Math.round(parseFloat(precioBase) * 100) : undefined,
      precio: precio || undefined,
      priceNote: priceNote || undefined,
      whatsappLink: whatsappLink || undefined,
      descripcionLarga: cleanArray(descripcionLarga),
      highlights: cleanArray(highlights),
      imagenPrincipal: imagenPrincipal || undefined,
      galeria: cleanArray(galeria),
      itinerario: cleanItinerario(itinerario),
      incluye: cleanArray(incluye),
      noIncluye: cleanArray(noIncluye),
      recomendaciones: cleanArray(recomendaciones),
      isActive,
      orden: parseInt(orden) || 0,
    };

    try {
      if (isEditing) {
        await excursionesApi.update(excursion!.id, payload);
      } else {
        await excursionesApi.create(payload);
      }
      queryClient.invalidateQueries({ queryKey: ['excursiones'] });
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar';
      const details = err.response?.data?.errors;
      setError(details ? JSON.stringify(details, null, 2) : msg);
    } finally {
      setSaving(false);
    }
  };

  // Helpers for dynamic lists
  const updateStringList = (
    list: string[],
    setList: (v: string[]) => void,
    idx: number,
    value: string
  ) => {
    const next = [...list];
    next[idx] = value;
    setList(next);
  };

  const addToList = (list: string[], setList: (v: string[]) => void) =>
    setList([...list, '']);

  const removeFromList = (list: string[], setList: (v: string[]) => void, idx: number) =>
    setList(list.filter((_, i) => i !== idx));

  const updateItinerarioItem = (
    idx: number,
    field: keyof ItinerarioItem,
    value: string
  ) => {
    const next = [...itinerario];
    next[idx] = { ...next[idx], [field]: value };
    setItinerario(next);
  };

  const addItinerarioItem = () =>
    setItinerario([...itinerario, { hora: '', actividad: '', descripcion: '' }]);

  const removeItinerarioItem = (idx: number) =>
    setItinerario(itinerario.filter((_, i) => i !== idx));

  const fieldClass =
    'w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Hidden file input para upload de imágenes */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar: ${excursion?.titulo}` : 'Nueva Excursión'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">
              {error}
            </div>
          )}

          {/* ── Sección 1: Datos básicos ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Datos básicos
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => handleTituloChange(e.target.value)}
                    placeholder="Arqueología en los Valles"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                    placeholder="arqueologia-en-los-valles"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="subtitulo">Subtítulo</Label>
                  <Input
                    id="subtitulo"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Una experiencia única..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tag">Tag / Badge</Label>
                  <Input
                    id="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Arqueología"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="duracion">Duración</Label>
                  <Input
                    id="duracion"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    placeholder="8 horas"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="salida">Salida</Label>
                  <Input
                    id="salida"
                    value={salida}
                    onChange={(e) => setSalida(e.target.value)}
                    placeholder="Mañana"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dificultad">Dificultad</Label>
                  <select
                    id="dificultad"
                    value={dificultad}
                    onChange={(e) => setDificultad(e.target.value as any)}
                    className={fieldClass}
                  >
                    <option value="">— Sin definir —</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grupoMax">Grupo máx *</Label>
                  <Input
                    id="grupoMax"
                    type="number"
                    value={grupoMax}
                    onChange={(e) => setGrupoMax(e.target.value)}
                    placeholder="12"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mejorEpoca">Mejor época</Label>
                <Input
                  id="mejorEpoca"
                  value={mejorEpoca}
                  onChange={(e) => setMejorEpoca(e.target.value)}
                  placeholder="Todo el año"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="precioBase">Precio base ($ARS)</Label>
                  <Input
                    id="precioBase"
                    type="number"
                    value={precioBase}
                    onChange={(e) => setPrecioBase(e.target.value)}
                    placeholder="120000"
                    min="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="precio">Precio display</Label>
                  <Input
                    id="precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="$120.000 por persona"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priceNote">Nota de precio</Label>
                  <Input
                    id="priceNote"
                    value={priceNote}
                    onChange={(e) => setPriceNote(e.target.value)}
                    placeholder="precio referencial..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsappLink">Link WhatsApp</Label>
                <Input
                  id="whatsappLink"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="https://wa.me/5493812345678?text=..."
                />
              </div>
            </div>
          </div>

          <hr />

          {/* ── Sección 2: Descripción ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Descripción de la experiencia
            </h3>
            <div className="space-y-2">
              {descripcionLarga.map((parrafo, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    value={parrafo}
                    onChange={(e) => updateStringList(descripcionLarga, setDescripcionLarga, idx, e.target.value)}
                    placeholder={`Párrafo ${idx + 1}...`}
                    rows={3}
                    className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(descripcionLarga, setDescripcionLarga, idx)}
                    disabled={descripcionLarga.length === 1}
                    className="shrink-0 mt-1"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToList(descripcionLarga, setDescripcionLarga)}
              >
                + Agregar párrafo
              </Button>
            </div>
          </div>

          <hr />

          {/* ── Sección 3: Highlights ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              ¿Qué vas a hacer?
            </h3>
            <div className="space-y-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateStringList(highlights, setHighlights, idx, e.target.value)}
                    placeholder="Visitar las ruinas de Quilmes..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(highlights, setHighlights, idx)}
                    disabled={highlights.length === 1}
                    className="shrink-0"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToList(highlights, setHighlights)}
              >
                + Agregar highlight
              </Button>
            </div>
          </div>

          <hr />

          {/* ── Sección 4: Imágenes ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Imágenes
            </h3>
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="space-y-1.5">
                <Label>Imagen principal</Label>
                <div className="flex gap-2">
                  <Input
                    value={imagenPrincipal}
                    onChange={(e) => setImagenPrincipal(e.target.value)}
                    placeholder="https://... o /images/excursion-hero.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => triggerUpload('principal')}
                    disabled={uploadingField === 'principal' || uploadingField === 'principal-resizing'}
                    className="shrink-0"
                  >
                    {uploadingField === 'principal-resizing'
                      ? 'Optimizando...'
                      : uploadingField === 'principal'
                        ? 'Subiendo...'
                        : 'Subir archivo'}
                  </Button>
                </div>
                {imagenPrincipal && (
                  <img
                    src={imagenPrincipal}
                    alt="Preview"
                    className="mt-2 h-32 w-auto rounded-md object-cover border border-border"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              {/* Galería */}
              <div>
                <Label className="mb-2 block">Galería</Label>
                <div className="space-y-2">
                  {galeria.map((url, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex gap-2">
                        <Input
                          value={url}
                          onChange={(e) => updateStringList(galeria, setGaleria, idx, e.target.value)}
                          placeholder="https://... o /images/foto.jpg"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerUpload('galeria', idx)}
                          disabled={!!uploadingField}
                          className="shrink-0"
                        >
                          {uploadingField === `galeria-${idx}-resizing`
                            ? 'Optimizando...'
                            : uploadingField === `galeria-${idx}`
                              ? 'Subiendo...'
                              : 'Subir'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromList(galeria, setGaleria, idx)}
                          disabled={galeria.length === 1}
                          className="shrink-0"
                        >
                          ✕
                        </Button>
                      </div>
                      {url && (
                        <img
                          src={url}
                          alt={`Galería ${idx + 1}`}
                          className="h-16 w-auto rounded object-cover border border-border"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToList(galeria, setGaleria)}
                  >
                    + Agregar imagen
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* ── Sección 5: Itinerario ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Itinerario
            </h3>
            <div className="space-y-3">
              {itinerario.map((item, idx) => (
                <div key={idx} className="border border-border rounded-md p-3 space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-24 shrink-0 space-y-1">
                      <Label className="text-xs">Hora</Label>
                      <Input
                        value={item.hora}
                        onChange={(e) => updateItinerarioItem(idx, 'hora', e.target.value)}
                        placeholder="08:00"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Actividad</Label>
                      <Input
                        value={item.actividad}
                        onChange={(e) => updateItinerarioItem(idx, 'actividad', e.target.value)}
                        placeholder="Salida desde la plaza central"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItinerarioItem(idx)}
                      disabled={itinerario.length === 1}
                      className="shrink-0 mt-5"
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descripción</Label>
                    <textarea
                      value={item.descripcion}
                      onChange={(e) => updateItinerarioItem(idx, 'descripcion', e.target.value)}
                      placeholder="Descripción detallada de esta etapa..."
                      rows={2}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItinerarioItem}
              >
                + Agregar etapa
              </Button>
            </div>
          </div>

          <hr />

          {/* ── Sección 6: Incluye / No incluye ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Incluye / No incluye
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">Incluye</p>
                <div className="space-y-2">
                  {incluye.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateStringList(incluye, setIncluye, idx, e.target.value)}
                        placeholder="Transporte de ida y vuelta"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromList(incluye, setIncluye, idx)}
                        disabled={incluye.length === 1}
                        className="shrink-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToList(incluye, setIncluye)}
                  >
                    + Agregar
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-red-700 dark:text-red-400">No incluye</p>
                <div className="space-y-2">
                  {noIncluye.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateStringList(noIncluye, setNoIncluye, idx, e.target.value)}
                        placeholder="Alimentos y bebidas"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromList(noIncluye, setNoIncluye, idx)}
                        disabled={noIncluye.length === 1}
                        className="shrink-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToList(noIncluye, setNoIncluye)}
                  >
                    + Agregar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* ── Sección 7: Recomendaciones ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Recomendaciones
            </h3>
            <div className="space-y-2">
              {recomendaciones.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateStringList(recomendaciones, setRecomendaciones, idx, e.target.value)}
                    placeholder="Llevar protector solar..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromList(recomendaciones, setRecomendaciones, idx)}
                    disabled={recomendaciones.length === 1}
                    className="shrink-0"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToList(recomendaciones, setRecomendaciones)}
              >
                + Agregar recomendación
              </Button>
            </div>
          </div>

          <hr />

          {/* ── Sección 8: Configuración ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Configuración
            </h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Excursión activa (visible en el sitio)
              </label>
              <div className="flex items-center gap-2">
                <Label htmlFor="orden" className="text-sm whitespace-nowrap">Orden:</Label>
                <Input
                  id="orden"
                  type="number"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="w-20"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear excursión'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
