"use client";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project, Task } from "@/lib/types";
import EditTaskDialog from "@/components/layout/editTaskDialog";
import AddTaskDialog from "@/components/layout/addTaskDialog";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useTaskStore } from "@/store/useTaskStore";
import EmptyTaskPage from "@/components/layout/emptyTaskPage";
import DeleteDialog from "@/components/layout/deleteDialog";
import NotFound from "@/app/not-found";

export default function ProjectPage() {
  const { data: session } = useSession();
  const me = session?.user.role;
  const { id } = useParams<{ id: string }>();
  const [mytasks, setMyTasks] = useState<Task[]>([]);
  const [specificProject, setSpecificProjects] = useState<Project | null>(null);
  const { tasks, setTasks } = useTaskStore();

  const projectFromStore = useProjectStore((state) => state.getProjectById(id));

  const displayProject = projectFromStore || specificProject;

  useEffect(() => {
    if (!projectFromStore && id) {
      const fetchSingleProject = async () => {
        try {
          const res = await fetch(`/api/project/${id}`);
          const data = await res.json();
          setSpecificProjects(data.project);
        } catch (err) {
          console.error("Project fetch failed", err);
        }
      };
      fetchSingleProject();
    }
  }, [projectFromStore, id]);
  useEffect(() => {
    if (id) {
      const fetchTasks = async () => {
        const res = await fetch(
          `/api/task?projectId=${id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMyTasks(data.tasks);
          setTasks(data.tasks);
        }
      };
      fetchTasks();
    }
  }, [id]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (res.ok) {
        toast.success("Task Deleted Successfully");
        setMyTasks((prev) => prev.filter((t) => t._id !== taskId));
      } else {
        toast.error("Unable to delete task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleTaskAdded = (newTask: Task) => {
    setMyTasks((prev) => [...prev, newTask]);
  };
  if (!displayProject) {
    return (
      <div className="flex justify-center py-20">
        <NotFound/>
      </div>
    );
  }
  return (
    <article className="w-full max-w-10/12 mx-auto py-[5%] px-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{displayProject.title}</h2>
          <p className="text-muted-foreground font-medium mb-4">
            Client ID: {displayProject.clientId}
          </p>
        </div>{" "}
        {me === "Freelancer" && (
          <AddTaskDialog projectId={id} onTaskAdded={handleTaskAdded} />
        )}
      </div>

      {mytasks.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableCaption>A list of your project tasks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">S.No</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead>Status</TableHead>
                {me === "Freelancer" && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mytasks.map((t, idx) => (
                <TableRow key={t._id}>
                  <TableCell>
                    TSK{(idx + 1).toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        t.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </TableCell>
                  {me === "Freelancer" && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditTaskDialog
                          id={t._id}
                          title={t.title}
                          status={t.status}
                          setMytasks={setMyTasks}
                        />
                        <DeleteDialog
                          page={"Task"}
                          handleDeleteTask={handleDeleteTask}
                          id={t._id}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyTaskPage />
      )}
    </article>
  );
}
{
  /* <Button
  variant="destructive"
  size="icon"
  onClick={() => handleDeleteTask(t._id)}
>
  <Trash className="h-4 w-4" />
</Button>; */
}
