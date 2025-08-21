import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function AdminBreadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Inicio', href: '/admin' }
    ];

    if (pathSegments.length > 1) {
      const routes: Record<string, string> = {
        'events': 'Eventos',
        'users': 'Usuarios',
        'analytics': 'Analytics',
        'finances': 'Finanzas',
        'venues': 'Venues',
        'scanner': 'Escáner QR',
        'security': 'Seguridad',
        'settings': 'Configuración',
        'create': 'Crear',
        'edit': 'Editar',
        'categories': 'Categorías'
      };

      let currentPath = '';
      pathSegments.slice(1).forEach((segment, index) => {
        currentPath += `/${segment}`;
        const fullPath = `/admin${currentPath}`;
        const isLast = index === pathSegments.length - 2;
        
        breadcrumbs.push({
          name: routes[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href: isLast ? undefined : fullPath
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-2 text-sm">
        <Home className="w-4 h-4 text-gray-400" />
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.name}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}