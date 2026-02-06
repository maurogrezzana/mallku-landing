import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, type Lead } from '@/lib/api';
import { Search, Filter } from 'lucide-react';

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

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await getLeads({ page, status: statusFilter || undefined, search: search || undefined });
      setLeads(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  }

  return (
    <div className="leads-page">
      <div className="page-header">
        <h1>Leads</h1>
        <p>{total} contactos en total</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="new">Nuevos</option>
            <option value="contacted">Contactados</option>
            <option value="qualified">Calificados</option>
            <option value="converted">Convertidos</option>
            <option value="lost">Perdidos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Excursión</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link to={`/leads/${lead.id}`} className="link font-medium">
                        {lead.nombre}
                      </Link>
                    </td>
                    <td>
                      <a href={`mailto:${lead.email}`} className="link">{lead.email}</a>
                    </td>
                    <td>
                      {lead.telefono ? (
                        <a href={`tel:${lead.telefono}`} className="link">{lead.telefono}</a>
                      ) : '-'}
                    </td>
                    <td>{lead.excursionInteres || '-'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${STATUS_COLORS[lead.status]}20`,
                          color: STATUS_COLORS[lead.status],
                        }}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty">
                      No se encontraron leads
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                  className="btn btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
