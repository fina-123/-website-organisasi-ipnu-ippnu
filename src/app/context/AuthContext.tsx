import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'user' | 'admin', name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: memberData } = await supabase
            .from('members')
            .select('role, full_name')
            .eq('auth_id', session.user.id)
            .single();
          
          const role = memberData?.role || 'user';
          const newUser = { id: session.user.id, email: session.user.email!, role: role as 'user' | 'admin', name: memberData?.full_name };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
        }
      } else {
        const saved = localStorage.getItem('user');
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        }
      }
    };

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: memberData } = await supabase
            .from('members')
            .select('role, full_name')
            .eq('auth_id', session.user.id)
            .single();
          
          const role = memberData?.role || 'user';
          const newUser = { id: session.user.id, email: session.user.email!, role: role as 'user' | 'admin', name: memberData?.full_name };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = (email: string, role: 'user' | 'admin', name?: string) => {
    const newUser: User = { id: Date.now().toString(), email, role, name };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
