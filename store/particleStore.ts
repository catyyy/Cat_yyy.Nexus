import { create } from 'zustand';

interface ParticleState {
  points: { x: number; y: number }[];
  setPoints: (points: { x: number; y: number }[]) => void;
}

export const useParticleStore = create<ParticleState>((set) => ({
  points: [],
  setPoints: (points) => set({ points }),
}));
