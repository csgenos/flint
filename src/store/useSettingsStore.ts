import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  currency: string;
  locale: string;
  theme: 'light';
  sidebarCollapsed: boolean;
  setCurrency: (currency: string) => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currency: 'USD',
      locale: 'en-US',
      theme: 'light',
      sidebarCollapsed: false,
      setCurrency: (currency) => set({ currency }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: 'finch-settings' }
  )
);
