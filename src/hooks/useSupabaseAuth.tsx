import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, supabaseHelpers } from '../lib/supabase';
import { useNotifications } from './useNotifications';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (data: any) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await syncUserProfile(session.user);
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);

      // Handle auth events
      if (event === 'SIGNED_IN') {
        addNotification({
          type: 'success',
          title: 'Sesión iniciada',
          message: 'Bienvenido de vuelta',
          duration: 3000
        });
      } else if (event === 'SIGNED_OUT') {
        addNotification({
          type: 'info',
          title: 'Sesión cerrada',
          message: 'Has cerrado sesión correctamente',
          duration: 3000
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [addNotification]);

  const syncUserProfile = async (user: User) => {
    try {
      // Check if user exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // Create user profile
        const { error } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              email_verified: user.email_confirmed_at !== null,
              last_login: new Date().toISOString(),
            }
          ]);

        if (error) {
          console.error('Error creating user profile:', error);
        }
      } else {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      setIsAdmin(!!data);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabaseHelpers.signUp(email, password, userData);
    
    if (error) {
      addNotification({
        type: 'error',
        title: 'Error al registrarse',
        message: error.message,
        duration: 5000
      });
    } else {
      addNotification({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Revisa tu email para confirmar tu cuenta',
        duration: 5000
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseHelpers.signIn(email, password);
    
    if (error) {
      addNotification({
        type: 'error',
        title: 'Error al iniciar sesión',
        message: error.message,
        duration: 5000
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabaseHelpers.signOut();
    
    if (error) {
      addNotification({
        type: 'error',
        title: 'Error al cerrar sesión',
        message: error.message,
        duration: 5000
      });
    }

    return { error };
  };

  const updateProfile = async (data: any) => {
    if (!user) return { error: new Error('No user logged in') as AuthError };

    const { error } = await supabase.auth.updateUser(data);
    
    if (error) {
      addNotification({
        type: 'error',
        title: 'Error al actualizar perfil',
        message: error.message,
        duration: 5000
      });
    } else {
      addNotification({
        type: 'success',
        title: 'Perfil actualizado',
        message: 'Tu perfil ha sido actualizado correctamente',
        duration: 3000
      });
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}