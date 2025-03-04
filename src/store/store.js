
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      hasHydrated: false,
      login: (userData) => {
        set({ user: { ...userData, loginTime: Date.now() }, isLoggedIn: true });
      },
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      checkAuthExpiration: () => {
        const state = get();
        if (state.user) {
          const loginTime = state.user?.loginTime || 0;
          const currentTime = Date.now();
          if (currentTime - loginTime > 48 * 60 * 60 * 1000) {
            state.logout();
          }
        }
      },
    }),
    {
      name: "auth-storage", 
      getStorage: () => localStorage, 
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuthExpiration();
          state.hasHydrated = true; 
        }
      },
    }
  )
);

export default useAuthStore;


