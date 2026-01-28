import { create } from 'zustand';

export interface WindowState {
    id: string;
    title: string;
    type: 'PDF' | 'Terminal' | 'Prose' | 'Media' | 'README' | 'Portfolio' | 'Contact' | 'Chat';
    content?: unknown;
    zIndex: number;
    isMinimized: boolean;
    isOpen: boolean;
}

interface OSState {
    openWindows: WindowState[];
    focusedWindow: string | null;
    systemSound: boolean;
    maxZIndex: number;
    openWindow: (window: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isOpen'>) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    toggleSound: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    openWindows: [],
    focusedWindow: null,
    systemSound: true,
    maxZIndex: 10,

    openWindow: (windowData) => {
        const { openWindows, maxZIndex } = get();
        const existingWindow = openWindows.find((w) => w.id === windowData.id);

        if (existingWindow) {
            if (existingWindow.isMinimized) {
                set({
                    openWindows: openWindows.map((w) =>
                        w.id === windowData.id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w
                    ),
                    focusedWindow: windowData.id,
                    maxZIndex: maxZIndex + 1,
                });
            } else {
                get().focusWindow(windowData.id);
            }
            return;
        }

        const newWindow: WindowState = {
            ...windowData,
            zIndex: maxZIndex + 1,
            isMinimized: false,
            isOpen: true,
        };

        set({
            openWindows: [...openWindows, newWindow],
            focusedWindow: windowData.id,
            maxZIndex: maxZIndex + 1,
        });
    },

    closeWindow: (id) => {
        set((state) => ({
            openWindows: state.openWindows.filter((w) => w.id !== id),
            focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
        }));
    },

    focusWindow: (id) => {
        const { maxZIndex, openWindows } = get();
        set({
            openWindows: openWindows.map((w) =>
                w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w
            ),
            focusedWindow: id,
            maxZIndex: maxZIndex + 1,
        });
    },

    minimizeWindow: (id) => {
        set((state) => ({
            openWindows: state.openWindows.map((w) =>
                w.id === id ? { ...w, isMinimized: true } : w
            ),
            focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
        }));
    },

    toggleSound: () => set((state) => ({ systemSound: !state.systemSound })),
}));
