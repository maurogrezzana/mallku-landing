import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getLeads, type Lead, type Stats } from '@/lib/api';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  converted: 'Convertido',
  lost: 'Perdido',
};

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#8b5cf6',
  converted: '#22c55e',
  lost: '#ef4444',
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          getStats(),
          getLeads({ page: 1 }),
        ]);
        setStats(statsRes.data);
        setRecentLeads(leadsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general del CRM</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.totalLeads || 0}</span>
            <span className="kpi-label">Leads Totales</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#22c55e20', color: '#22c55e' }}>
            <UserPlus size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.newToday || 0}</span>
            <span className="kpi-label">Nuevos Hoy</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
            <UserCheck size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.byStatus.converted || 0}</span>
            <span className="kpi-label">Convertidos</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">
              {stats && stats.totalLeads > 0
                ? Math.round((stats.byStatus.converted / stats.totalLeads) * 100)
                : 0}%
            </span>
            <span className="kpi-label">Conversión</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <h2>Estado de Leads</h2>
        <div className="status-bars">
          {stats && Object.entries(stats.byStatus).map(([key, value]) => (
            <div key={key} className="status-bar-row">
              <span className="status-bar-label">
                <span className="status-dot" style={{ background: STATUS_COLORS[key] }} />
                {STATUS_LABELS[key]}
              </span>
              <div className="status-bar-track">
                <div
                  className="status-bar-fill"
                  style={{
                    width: stats.totalLeads > 0 ? `${(value / stats.totalLeads) * 100}%` : '0%',
                    background: STATUS_COLORS[key],
                  }}
                />
              </div>
              <span className="status-bar-count">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="card-header">
          <h2>Leads Recientes</h2>
          <Link to="/leads" className="btn btn-sm">Ver todos</Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Excursión</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <Link to={`/leads/${lead.id}`} className="link">
                    {lead.nombre}
                  </Link>
                </td>
                <td>{lead.email}</td>
                <td>{lead.excursionInteres || '-'}</td>
                <td>
                  <span className="badge" style={{ background: `${STATUS_COLORS[lead.status]}20`, color: STATUS_COLORS[lead.status] }}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
            {recentLeads.length === 0 && (
              <tr><td colSpan={5} className="empty">No hay leads aún</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
