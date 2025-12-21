import { create } from 'zustand';
import { ProjectCard } from '@/lib/projects';

interface ProjectState {
  projects: ProjectCard[];
  setProjects: (projects: ProjectCard[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
