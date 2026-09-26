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
const USERS_REGISTRY_KEY = 'slink_registered_accounts_db';

interface RegisteredAccount {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  name: string;
}

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

function getRegisteredAccounts(): Record<string, RegisteredAccount> {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveRegisteredAccounts(accounts: Record<string, RegisteredAccount>) {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save registered accounts:', err);
  }
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_slink_secure_salt_v1');
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  let hash = 0;
  const str = password + '_slink_salt_fallback';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

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

  async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ user: AppUser | null; error: string | null }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { user: null, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { user: null, error: 'Please enter your password.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
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

    // Local Supabase verification simulation
    await new Promise((res) => setTimeout(res, 400));

    const accounts = getRegisteredAccounts();
    const existing = accounts[normalizedEmail];

    if (!existing) {
      return {
        user: null,
        error: `No account found with email "${normalizedEmail}". Please switch to NEW ACCOUNT to create one first.`,
      };
    }

    const inputHash = await hashPassword(password);
    if (existing.passwordHash !== inputHash) {
      return {
        user: null,
        error: 'Invalid password. Please check your password and try again.',
      };
    }

    const appUser: AppUser = {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      isMock: true,
    };
    setStoredLocalUser(appUser);
    return { user: appUser, error: null };
  },

  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<{ user: AppUser | null; error: string | null; message?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { user: null, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { user: null, error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
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

    // Local Supabase verification simulation
    await new Promise((res) => setTimeout(res, 400));

    const accounts = getRegisteredAccounts();
    if (accounts[normalizedEmail]) {
      return {
        user: null,
        error: `An account with "${normalizedEmail}" already exists. Please choose SIGN IN instead.`,
      };
    }

    const pHash = await hashPassword(password);
    const newId = `usr_${Math.random().toString(36).substring(2, 10)}`;
    const newAccount: RegisteredAccount = {
      id: newId,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      passwordHash: pHash,
      createdAt: new Date().toISOString(),
    };

    accounts[normalizedEmail] = newAccount;
    saveRegisteredAccounts(accounts);

    const appUser: AppUser = {
      id: newId,
      email: normalizedEmail,
      name: newAccount.name,
      isMock: true,
    };
    setStoredLocalUser(appUser);

    return {
      user: appUser,
      error: null,
      message: `Account created successfully! Welcome, ${appUser.name}.`,
    };
  },

  async signInWithOtp(
    email: string
  ): Promise<{ success: boolean; error: string | null; message?: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
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

    await new Promise((res) => setTimeout(res, 400));

    const accounts = getRegisteredAccounts();
    let account = accounts[normalizedEmail];

    if (!account) {
      // Auto-register OTP user with random secure hash
      const newId = `usr_${Math.random().toString(36).substring(2, 10)}`;
      account = {
        id: newId,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        passwordHash: await hashPassword('magic_otp_secured_' + Math.random()),
        createdAt: new Date().toISOString(),
      };
      accounts[normalizedEmail] = account;
      saveRegisteredAccounts(accounts);
    }

    const appUser: AppUser = {
      id: account.id,
      email: account.email,
      name: account.name,
      isMock: true,
    };
    setStoredLocalUser(appUser);

    return {
      success: true,
      error: null,
      message: `Magic link verified! Signed in as ${normalizedEmail}.`,
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
