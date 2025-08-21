export interface LayoutConfig {
  sidebar: boolean;
  header: boolean;
  footer: boolean;
  breadcrumbs: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: any;
  permission?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

export abstract class BaseLayout {
  protected config: LayoutConfig;
  protected navigation: NavigationItem[];

  constructor(config: Partial<LayoutConfig> = {}) {
    this.config = {
      sidebar: true,
      header: true,
      footer: true,
      breadcrumbs: true,
      notifications: true,
      theme: 'light',
      maxWidth: 'full',
      ...config
    };
    this.navigation = [];
  }

  abstract getNavigation(): NavigationItem[];
  abstract getLayoutClasses(): string;
  abstract getContainerClasses(): string;

  setTheme(theme: LayoutConfig['theme']) {
    this.config.theme = theme;
  }

  toggleSidebar() {
    this.config.sidebar = !this.config.sidebar;
  }

  addNavigationItem(item: NavigationItem) {
    this.navigation.push(item);
  }

  removeNavigationItem(id: string) {
    this.navigation = this.navigation.filter(item => item.id !== id);
  }

  getConfig(): LayoutConfig {
    return { ...this.config };
  }
}

export class AdminLayoutManager extends BaseLayout {
  constructor() {
    super({
      sidebar: true,
      header: true,
      footer: false,
      breadcrumbs: true,
      notifications: true,
      theme: 'light',
      maxWidth: 'full'
    });
  }

  getNavigation(): NavigationItem[] {
    return [
      {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/admin',
        icon: 'LayoutDashboard',
        permission: 'view_dashboard'
      },
      {
        id: 'events',
        name: 'Eventos',
        href: '/admin/events',
        icon: 'Calendar',
        permission: 'manage_events',
        children: [
          { id: 'events-list', name: 'Lista de Eventos', href: '/admin/events', icon: 'List' },
          { id: 'events-create', name: 'Crear Evento', href: '/admin/events/create', icon: 'Plus' },
          { id: 'events-categories', name: 'Categorías', href: '/admin/events/categories', icon: 'Tag' }
        ]
      },
      {
        id: 'users',
        name: 'Usuarios',
        href: '/admin/users',
        icon: 'Users',
        permission: 'manage_users',
        badge: '1.2K'
      },
      {
        id: 'analytics',
        name: 'Analytics',
        href: '/admin/analytics',
        icon: 'BarChart3',
        permission: 'view_analytics'
      },
      {
        id: 'finances',
        name: 'Finanzas',
        href: '/admin/finances',
        icon: 'DollarSign',
        permission: 'financial_reports'
      },
      {
        id: 'venues',
        name: 'Venues',
        href: '/admin/venues',
        icon: 'MapPin',
        permission: 'manage_venues'
      },
      {
        id: 'scanner',
        name: 'Escáner QR',
        href: '/admin/scanner',
        icon: 'QrCode',
        permission: 'scan_tickets'
      },
      {
        id: 'security',
        name: 'Seguridad',
        href: '/admin/security',
        icon: 'Shield',
        permission: 'security_logs'
      },
      {
        id: 'settings',
        name: 'Configuración',
        href: '/admin/settings',
        icon: 'Settings',
        permission: 'system_settings'
      }
    ];
  }

  getLayoutClasses(): string {
    return 'min-h-screen bg-gray-50 flex';
  }

  getContainerClasses(): string {
    return 'flex-1 flex flex-col overflow-hidden';
  }
}

export class ClientLayoutManager extends BaseLayout {
  constructor() {
    super({
      sidebar: false,
      header: true,
      footer: true,
      breadcrumbs: false,
      notifications: true,
      theme: 'light',
      maxWidth: '2xl'
    });
  }

  getNavigation(): NavigationItem[] {
    return [
      {
        id: 'home',
        name: 'Inicio',
        href: '/',
        icon: 'Home'
      },
      {
        id: 'events',
        name: 'Eventos',
        href: '/events',
        icon: 'Calendar'
      },
      {
        id: 'categories',
        name: 'Categorías',
        href: '/categories',
        icon: 'Grid3X3'
      },
      {
        id: 'venues',
        name: 'Venues',
        href: '/venues',
        icon: 'MapPin'
      }
    ];
  }

  getLayoutClasses(): string {
    return 'min-h-screen flex flex-col bg-gray-50';
  }

  getContainerClasses(): string {
    const maxWidthClasses = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-4xl',
      'xl': 'max-w-6xl',
      '2xl': 'max-w-7xl',
      'full': 'max-w-full'
    };

    return `flex-1 ${maxWidthClasses[this.config.maxWidth]} mx-auto px-4 sm:px-6 lg:px-8`;
  }
}

