const AUTH_STORAGE_KEY = 'pokemon_app_auth';

export interface AuthUser {
  username: string;
}

export const authUtils = {
  isAuthenticated: (): boolean => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    return !!auth;
  },

  getUser: (): AuthUser | null => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch {
      return null;
    }
  },

  setUser: (user: AuthUser): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearAuth: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
