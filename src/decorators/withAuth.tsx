import React from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { Navigate } from 'react-router-dom';

export interface AuthRequirement {
  requireAuth: boolean;
  requireAdmin?: boolean;
  permissions?: string[];
  redirectTo?: string;
}

export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requirements: AuthRequirement
) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading, isAdmin } = useSupabaseAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (requirements.requireAuth && !user) {
      return <Navigate to={requirements.redirectTo || '/login'} replace />;
    }

    if (requirements.requireAdmin && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export function requireAuth(requirements: Partial<AuthRequirement> = {}) {
  return function <T extends object>(Component: React.ComponentType<T>) {
    return withAuth(Component, {
      requireAuth: true,
      ...requirements
    });
  };
}

export function requireAdmin(requirements: Partial<AuthRequirement> = {}) {
  return function <T extends object>(Component: React.ComponentType<T>) {
    return withAuth(Component, {
      requireAuth: true,
      requireAdmin: true,
      ...requirements
    });
  };
}