import { Project } from "@/lib/types";
import { create } from "zustand";


interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  getProjectById: (id) => get().projects.find((p) => p._id === id),
}));
