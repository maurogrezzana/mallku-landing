import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { login, setup } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fn = isSetup ? setup : login;
      const result = await fn(email, password);
      setAuth(result.data.token, result.data.user);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      if (message.includes('no fue configurado') || message.includes('Credenciales')) {
        setError(message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">M</div>
          <h1>Mallku Admin</h1>
          <p>{isSetup ? 'Crear cuenta de administrador' : 'Iniciar sesión'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mallku.com.ar"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Cargando...' : isSetup ? 'Crear admin' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsSetup(!isSetup);
              setError('');
            }}
          >
            {isSetup ? 'Ya tengo cuenta' : 'Primera vez? Crear admin'}
          </button>
        </div>
      </div>
    </div>
  );
}
