import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home, MapPin, FileText, LogOut, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { authApi, alertasApi } from '@/lib/api';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/excursiones', label: 'Excursiones', icon: MapPin },
  { path: '/fechas', label: 'Fechas', icon: Calendar },
  { path: '/reservas', label: 'Reservas', icon: FileText },
  { path: '/alertas', label: 'Alertas', icon: Bell },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Badge: contar fechas urgentes (hoy/mañana) con al menos 1 cliente
  const { data: upcoming = [] } = useQuery({
    queryKey: ['alertas-upcoming'],
    queryFn: () => alertasApi.getUpcoming(7),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const urgentCount = upcoming.filter((item) => {
    const days = Math.ceil(
      (new Date(item.date.fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 1 && item.bookings.length > 0;
  }).length;

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mallku Admin</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.fullName}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const showBadge = item.path === '/alertas' && urgentCount > 0;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {urgentCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer: Dark mode toggle + Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
