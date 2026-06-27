import {create} from 'zustand';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'kaisa-theme';

type State = {
  theme: Theme;
  hydrated: boolean;
};

type Actions = {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
};

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const useThemeStore = create<State & Actions>((set, get) => ({
  theme: 'light',
  hydrated: false,
  setTheme: (theme) => {
    applyTheme(theme);
    set({theme});
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
  initTheme: () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const theme = stored === 'light' || stored === 'dark' ? stored : 'light';
    applyTheme(theme);
    set({theme, hydrated: true});
  },
}));

export default useThemeStore;
