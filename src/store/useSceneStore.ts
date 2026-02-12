import { create } from 'zustand';

export interface Asset3D {
    id: string;
    path: string;
    name: string;
    section: 'homepage' | 'altered-state' | 'music' | 'bass-fantasy' | 'tech-fantasy' | 'anime';
}

interface SceneState {
    // Current active asset - ONLY ONE AT A TIME
    activeAsset: Asset3D | null;

    // Loading state
    isLoading: boolean;
    loadProgress: number;

    // Transition state
    isTransitioning: boolean;

    // Current section
    currentSection: string;
    scrollProgress: number;

    // Manual performance override
    performanceMode: boolean;

    // Actions
    setActiveAsset: (asset: Asset3D | null) => void;
    setLoading: (loading: boolean, progress?: number) => void;
    setTransitioning: (transitioning: boolean) => void;
    setCurrentSection: (section: string) => void;
    setScrollProgress: (progress: number) => void;
    setPerformanceMode: (enabled: boolean) => void;
    togglePerformanceMode: () => void;

    // Transition with cleanup
    transitionToAsset: (newAsset: Asset3D | null) => Promise<void>;
}

export const useSceneStore = create<SceneState>((set, get) => ({
    activeAsset: null,
    isLoading: true,
    loadProgress: 0,
    isTransitioning: false,
    currentSection: 'loader',
    scrollProgress: 0,
    performanceMode: false,

    setActiveAsset: (asset) => set({ activeAsset: asset }),

    setLoading: (loading, progress = 0) => set({
        isLoading: loading,
        loadProgress: progress
    }),

    setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

    setCurrentSection: (section) => set({ currentSection: section }),

    setScrollProgress: (progress) => set({ scrollProgress: progress }),

    setPerformanceMode: (enabled) => set({ performanceMode: enabled }),

    togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode })),

    // Critical: Ensures previous asset is fully unmounted before new one loads
    transitionToAsset: async (newAsset) => {
        const { activeAsset, isTransitioning } = get();

        // Prevent overlapping transitions
        if (isTransitioning) return;

        // If same asset, no-op
        if (activeAsset?.id === newAsset?.id) return;

        set({ isTransitioning: true });

        // Exit animation timing (600ms per spec)
        if (activeAsset) {
            set({ activeAsset: null });
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Enter new asset (800ms per spec)
        if (newAsset) {
            set({ activeAsset: newAsset });
        }

        set({ isTransitioning: false });
    },
}));

// Asset registry - maps section to available assets
export const ASSET_REGISTRY: Record<string, Asset3D[]> = {
    homepage: [
        { id: 'brutalist-interior', path: '/assets/3d/brutalist_interior.glb', name: 'Brutalist Interior', section: 'homepage' },
    ],
    'altered-state': [
        { id: 'marlboro', path: '/assets/3d/marlboro_pack_of_20_cigarettes.glb', name: 'Marlboro Pack', section: 'altered-state' },
        { id: 'moon-nug', path: '/assets/3d/moon_nonkey_nug.glb', name: 'Moon Nug', section: 'altered-state' },
        { id: 'joint', path: '/assets/3d/weed_joint.glb', name: 'Joint', section: 'altered-state' },
    ],
    'music': [
        { id: 'walkman', path: '/assets/3d/walkman.glb', name: 'Walkman', section: 'music' },
    ],
    'bass-fantasy': [
        { id: 'marceline-bass', path: '/assets/3d/marcelines_ax_bass.glb', name: "Marceline's Ax Bass", section: 'bass-fantasy' },
        { id: 'fender-amp', path: '/assets/3d/fender_bass_amp.glb', name: 'Fender Bass Amp', section: 'bass-fantasy' },
    ],
    'tech-fantasy': [
        { id: 'retro-camera', path: '/assets/3d/canon_at-1_retro_camera.glb', name: 'Canon AT-1 Camera', section: 'tech-fantasy' },
        { id: 'cyberpunk-laptop', path: '/assets/3d/cyberpunk_laptop_concept_design.glb', name: 'Cyberpunk Laptop', section: 'tech-fantasy' },
        { id: 'sony-playstation', path: '/assets/3d/sony_pvm-1341__sony_playstation.glb', name: 'Sony PVM & PlayStation', section: 'tech-fantasy' },
    ],
    'anime': [
        { id: 'aot-sword', path: '/assets/3d/attack_on_titan_gear_sword_-_low_poly.glb', name: 'ODM Gear Sword', section: 'anime' },
        { id: 'colossal-titan', path: '/assets/3d/colossal_titan.glb', name: 'Colossal Titan', section: 'anime' },
    ],
};
