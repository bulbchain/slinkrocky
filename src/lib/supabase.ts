import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  isMock?: boolean;
}

const LOCAL_STORAGE_KEY = 'slink_supabase_auth_user';

export const getStoredLocalUser = (): AppUser | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredLocalUser = (user: AppUser | null) => {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update local user storage:', err);
  }
};

export const supabaseAuth = {
  isConfigured: isSupabaseConfigured,

  async getCurrentUser(): Promise<AppUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user || !user.email) {
          return getStoredLocalUser();
        }
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          isMock: false,
        };
      } catch {
        return getStoredLocalUser();
      }
    }
    return getStoredLocalUser();
  },

  async signInWithEmail(email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (!data.user?.email) {
        return { user: null, error: 'User email not found.' };
      }
      const appUser: AppUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        isMock: false,
      };
      setStoredLocalUser(appUser);
      return { user: appUser, error: null };
    }

    // Local Supabase simulation fallback
    await new Promise((res) => setTimeout(res, 450));
    if (!email || !email.includes('@')) {
      return { user: null, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { user: null, error: 'Password must be at least 6 characters long.' };
    }

    const mockUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      isMock: true,
    };
    setStoredLocalUser(mockUser);
    return { user: mockUser, error: null };
  },

  async signUpWithEmail(email: string, password: string): Promise<{ user: AppUser | null; error: string | null; message?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (!data.user?.email) {
        return { user: null, error: 'Signup failed. Please try again.' };
      }
      const appUser: AppUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        isMock: false,
      };
      setStoredLocalUser(appUser);
      return {
        user: appUser,
        error: null,
        message: data.session ? undefined : 'Confirmation email sent! Check your inbox to verify.',
      };
    }

    // Local Supabase simulation fallback
    await new Promise((res) => setTimeout(res, 450));
    if (!email || !email.includes('@')) {
      return { user: null, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { user: null, error: 'Password must be at least 6 characters long.' };
    }

    const mockUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      isMock: true,
    };
    setStoredLocalUser(mockUser);
    return { user: mockUser, error: null };
  },

  async signInWithOtp(email: string): Promise<{ success: boolean; error: string | null; message?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return {
        success: true,
        error: null,
        message: 'Magic link sent to your email! Click the link to log in.',
      };
    }

    await new Promise((res) => setTimeout(res, 500));
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const mockUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      isMock: true,
    };
    setStoredLocalUser(mockUser);
    return {
      success: true,
      error: null,
      message: 'Magic link demo: signed in successfully!',
    };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    setStoredLocalUser(null);
  },

  onAuthStateChange(callback: (user: AppUser | null) => void) {
    if (isSupabaseConfigured && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          const user: AppUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            isMock: false,
          };
          setStoredLocalUser(user);
          callback(user);
        } else {
          setStoredLocalUser(null);
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
  },
};
