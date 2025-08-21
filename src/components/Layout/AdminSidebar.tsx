import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  X,
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  DollarSign,
  MapPin,
  QrCode,
  Shield,
  Settings,
  List,
  Plus,
  Tag
} from 'lucide-react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { AdminLayoutManager, NavigationItem } from '../../classes/LayoutManager';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  layoutManager: AdminLayoutManager;
}

const iconMap = {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  DollarSign,
  MapPin,
  QrCode,
  Shield,
  Settings,
  List,
  Plus,
  Tag
};

export function AdminSidebar({ isOpen, onClose, layoutManager }: AdminSidebarProps) {
  const { user, signOut } = useSupabaseAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['events']);

  const navigation = layoutManager.getNavigation();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id}>
        <div className="flex items-center">
          <Link
            to={item.href}
            className={`flex-1 flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
            style={{ paddingLeft: `${16 + level * 16}px` }}
          >
            {IconComponent && <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />}
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                active ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`p-2 rounded-lg transition-colors ${
                active ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
          <Link to="/admin" className="text-white text-xl font-bold">
            🎫 Tiketera Admin
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map(item => renderNavigationItem(item))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-700 p-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  Super Admin
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-green-400 font-bold">1,247</div>
                <div className="text-gray-400">Usuarios</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-blue-400 font-bold">156</div>
                <div className="text-gray-400">Eventos</div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}