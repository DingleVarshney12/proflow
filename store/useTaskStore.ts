import { Task } from "@/lib/types";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  getTaskById: (id) => get().tasks.find((p) => p._id === id),
}));
