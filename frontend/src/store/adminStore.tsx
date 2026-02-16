import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  token: string | null;
  isAuthenticated: boolean;
  setLogin: (token: string) => void;
  setLogout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setLogin: (token) => set({ token, isAuthenticated: true }),
      setLogout: () => set({ token: null, isAuthenticated: false }),
    }),
    { name: 'crowned-admin-session' }
  )
);