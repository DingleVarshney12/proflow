"use client";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useState } from "react";
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
import EmptyTaskPage from "@/components/layout/emptyTaskPage";
import DeleteDialog from "@/components/layout/deleteDialog";
import NotFound from "@/app/not-found";
import PaginationComp from "@/components/layout/pagination";
import Loader from "@/components/ui/loader";

export default function ProjectPage() {
  const { data: session, status } = useSession();

  const me = session?.user.role;
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [mytasks, setMyTasks] = useState<Task[]>([]);
  const [specificProject, setSpecificProjects] = useState<Project | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const projectFromStore = useProjectStore((state) =>
    typeof id === "string" ? state.getProjectById(id) : undefined
  );
  const [taskPagination, setTaskPagination] = useState<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!id) return;

    const fetchSingleProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/project/${id}`);

        if (!res.ok) {
          setSpecificProjects(null);
          return;
        }

        const data = await res.json();
        setSpecificProjects(data.project);
      } catch {
        setSpecificProjects(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProject();
  }, [id, status]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      if (id) {
        const res = await fetch(
          `/api/task?projectId=${id}&page=${page}&limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          setMyTasks(data.tasks);
          setTaskPagination(data.pagination);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching tasks.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [id, page]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (res.ok) {
        toast.success("Task Deleted Successfully");
        await fetchTasks();
      } else {
        toast.error("Unable to delete task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleTaskAdded = async () => {
    await fetchTasks();
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center py-20">Loading project...</div>;
  }
  const displayProject = specificProject || projectFromStore;

  if (!displayProject) {
    return <NotFound />;
  }
  return (
    <article className="w-full max-w-10/12 mx-auto py-[5%] px-2">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold mb-2">{displayProject.title}</h2>
          <p className="text-muted-foreground font-medium mb-4">
            Client ID: {displayProject.clientId}
          </p>
        </div>
        {me === "Freelancer" && id && (
          <AddTaskDialog projectId={id} onTaskAdded={handleTaskAdded} />
        )}
      </div>

      {status === "authenticated" && mytasks.length > 0 ? (
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
                    TSK{((page - 1) * 10 + idx + 1).toString().padStart(3, "0")}
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
          <PaginationComp
            paginationDetails={taskPagination}
            setPage={setPage}
            page={page}
          />
        </div>
      ) : (
        <EmptyTaskPage />
      )}
    </article>
  );
}
