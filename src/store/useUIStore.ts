import { create } from 'zustand';

interface UIState {
    experimentalMode: boolean;
    setExperimentalMode: (enabled: boolean) => void;
    toggleExperimentalMode: () => void;
    activeRupture: string | null;
    setActiveRupture: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    experimentalMode: false,
    setExperimentalMode: (enabled) => set({ experimentalMode: enabled }),
    toggleExperimentalMode: () => set((state) => ({ experimentalMode: !state.experimentalMode })),
    activeRupture: null,
    setActiveRupture: (id) => set({ activeRupture: id }),
}));
