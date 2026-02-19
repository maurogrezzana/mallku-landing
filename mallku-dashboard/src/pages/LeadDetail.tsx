import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLead, updateLead, type Lead } from '@/lib/api';
import { ArrowLeft, Mail, Phone, Calendar, Tag } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo', color: '#3b82f6' },
  { value: 'contacted', label: 'Contactado', color: '#f59e0b' },
  { value: 'qualified', label: 'Calificado', color: '#8b5cf6' },
  { value: 'converted', label: 'Convertido', color: '#22c55e' },
  { value: 'lost', label: 'Perdido', color: '#ef4444' },
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchLead() {
      try {
        const res = await getLead(id!);
        setLead(res.data);
        setNotas(res.data.notas || '');
      } catch (err) {
        console.error('Error fetching lead:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!id || !lead) return;
    setSaving(true);
    try {
      const res = await updateLead(id, { status: newStatus });
      setLead(res.data);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotas() {
    if (!id) return;
    setSaving(true);
    try {
      const res = await updateLead(id, { notas });
      setLead(res.data);
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading">Cargando...</div>;
  if (!lead) return <div className="empty">Lead no encontrado</div>;

  return (
    <div className="lead-detail">
      <button className="btn btn-ghost" onClick={() => navigate('/leads')}>
        <ArrowLeft size={18} /> Volver a leads
      </button>

      <div className="page-header">
        <h1>{lead.nombre}</h1>
        <span
          className="badge badge-lg"
          style={{
            background: `${STATUS_OPTIONS.find((s) => s.value === lead.status)?.color}20`,
            color: STATUS_OPTIONS.find((s) => s.value === lead.status)?.color,
          }}
        >
          {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label}
        </span>
      </div>

      <div className="detail-grid">
        {/* Info Card */}
        <div className="card">
          <h3>Información de Contacto</h3>
          <div className="info-list">
            <div className="info-item">
              <Mail size={16} />
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </div>
            {lead.telefono && (
              <div className="info-item">
                <Phone size={16} />
                <a href={`tel:${lead.telefono}`}>{lead.telefono}</a>
              </div>
            )}
            {lead.excursionInteres && (
              <div className="info-item">
                <Tag size={16} />
                <span>{lead.excursionInteres}</span>
              </div>
            )}
            <div className="info-item">
              <Calendar size={16} />
              <span>
                {new Date(lead.createdAt).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {lead.mensaje && (
            <div className="message-box">
              <h4>Mensaje</h4>
              <p>{lead.mensaje}</p>
            </div>
          )}

          {lead.source && (
            <div className="meta">
              <span>Fuente: {lead.source}</span>
            </div>
          )}
        </div>

        {/* Actions Card */}
        <div className="card">
          <h3>Cambiar Estado</h3>
          <div className="status-buttons">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`btn btn-status ${lead.status === opt.value ? 'active' : ''}`}
                style={{
                  borderColor: opt.color,
                  background: lead.status === opt.value ? opt.color : 'transparent',
                  color: lead.status === opt.value ? '#fff' : opt.color,
                }}
                onClick={() => handleStatusChange(opt.value)}
                disabled={saving || lead.status === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="notes-section">
            <h3>Notas Internas</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Agregar notas sobre este lead..."
              rows={5}
            />
            <button
              className="btn btn-primary"
              onClick={handleSaveNotas}
              disabled={saving || notas === (lead.notas || '')}
            >
              {saving ? 'Guardando...' : 'Guardar notas'}
            </button>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <h3>Timeline</h3>
            <div className="timeline-item">
              <div className="timeline-dot" style={{ background: '#3b82f6' }} />
              <div className="timeline-content">
                <strong>Lead creado</strong>
                <span>{new Date(lead.createdAt).toLocaleString('es-AR')}</span>
              </div>
            </div>
            {lead.contactedAt && (
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: '#f59e0b' }} />
                <div className="timeline-content">
                  <strong>Contactado</strong>
                  <span>{new Date(lead.contactedAt).toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
            {lead.convertedAt && (
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: '#22c55e' }} />
                <div className="timeline-content">
                  <strong>Convertido</strong>
                  <span>{new Date(lead.convertedAt).toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
