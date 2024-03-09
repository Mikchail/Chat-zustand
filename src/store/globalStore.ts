import { create } from 'zustand';

type GlobalState = {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Создаем глобальный стейт
export const useGlobalState = create<GlobalState>((set) => ({
  token: null,
  setToken: (token) => set(() => ({ token })),
}));
