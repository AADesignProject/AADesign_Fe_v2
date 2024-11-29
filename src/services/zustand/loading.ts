import { create } from 'zustand';

type Store = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<Store>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
