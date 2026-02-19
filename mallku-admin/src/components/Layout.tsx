import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home, MapPin, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/excursiones', label: 'Excursiones', icon: MapPin },
  { path: '/fechas', label: 'Fechas', icon: Calendar },
  { path: '/reservas', label: 'Reservas', icon: FileText },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Mallku Admin</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.fullName}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
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
