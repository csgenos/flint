import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { OnboardingProfile } from '../types/planning';
import { createLegacyStateStorage } from '../lib/storage/localStore';
import { inferTaxResidency } from '../data/taxes/jurisdictions';

interface SettingsStore {
  currency: string;
  locale: string;
  theme: 'light';
  sidebarCollapsed: boolean;
  onboarding: OnboardingProfile | null;
  setCurrency: (currency: string) => void;
  setLocale: (locale: string) => void;
  toggleSidebar: () => void;
  completeOnboarding: (profile: OnboardingProfile) => void;
  resetOnboarding: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currency: 'USD',
      locale: 'en-US',
      theme: 'light',
      sidebarCollapsed: false,
      onboarding: null,
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      completeOnboarding: (profile) => set({ onboarding: profile, currency: profile.currency }),
      resetOnboarding: () => set({ onboarding: null }),
    }),
    {
      name: 'flint-settings',
      version: 3,
      storage: createJSONStorage(() => createLegacyStateStorage(['finch-settings'])),
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as Partial<SettingsStore>;

        const onboarding = state.onboarding
          ? {
              ...state.onboarding,
              taxResidency:
                state.onboarding.taxResidency ??
                inferTaxResidency(state.onboarding.country, state.onboarding.state),
            }
          : null;

        if (version < 3) {
          return {
            currency: state.currency ?? 'USD',
            locale: state.locale ?? 'en-US',
            theme: 'light',
            sidebarCollapsed: state.sidebarCollapsed ?? false,
            onboarding,
          };
        }

        return {
          ...state,
          onboarding,
        } as SettingsStore;
      },
    }
  )
);
