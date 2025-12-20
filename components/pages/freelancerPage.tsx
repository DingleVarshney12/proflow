"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "sonner";
import { Project } from "@/lib/types";
import EmptyProjectPage from "../layout/emptyProjectPage";
import DeleteDialog from "../layout/deleteDialog";
import PaginationComp from "../layout/pagination";
import { useSession } from "next-auth/react";
import Loader from "../ui/loader";
const FreelancerPage: React.FC = () => {
  const { status } = useSession();
  const { setProjects } = useProjectStore();
  const [myProject, setMyProjects] = useState<Project[]>([]);
  const [projectSummary, setProjectSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectPagination, setProjectPagination] = useState<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
  } | null>(null);
  const [page, setPage] = useState(1);

  const fetchProjects = async (forcePage?: number) => {
    try {
      setLoading(true);
      const currentPage = forcePage ?? page;
      const res = await fetch(`/api/project?page=${currentPage}&limit=10`);
      if (!res.ok) return;

      const data = await res.json();
      if (
        data.projects.length === 0 &&
        currentPage > 1 &&
        data.pagination.totalPages < currentPage
      ) {
        setPage(data.pagination.totalPages || 1);
        return;
      }
      setProjects(data.projects);
      setMyProjects(data.projects);
      setProjectPagination(data.pagination);
      setProjectSummary(data.summary);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const summaryMap = useMemo(() => {
    return projectSummary.reduce((acc, item) => {
      acc[item.projectId] = item;
      return acc;
    }, {});
  }, [projectSummary]);

  const getStatus = (summary: any) => {
    if (!summary || summary.totalTasks === 0) return "Not started";
    if (summary.completedTasks === summary.totalTasks) return "Completed";
    return "In progress";
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/project`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });

      if (res.ok) {
        toast.success("Project Deleted Successfully");
        await fetchProjects();
      } else {
        toast.error("Unable to delete project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <Loader text="Fetching Projects" />;
  }
  return (
    <div className="md:max-w-10/12 w-full mx-auto py-[5%] px-2">
      {status === "authenticated" && myProject.length > 0 ? (
        <>
          <div className="w-full flex justify-end mb-4">
            <Link href={"/project/create"}>
              <Button>
                <Plus />
                Create Project
              </Button>
            </Link>
          </div>
          <Table>
            <TableCaption>A list of your project.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">S.No</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Client Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myProject.map((p, idx) => {
                const summary = summaryMap[p._id.toString()];

                return (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">
                      PRO
                      {((page - 1) * 10 + idx + 1).toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.clientId}</TableCell>
                    <TableCell>
                      {getStatus(summary) === "Completed"
                        ? "All task Completed"
                        : summary
                        ? `${summary.completedTasks} / ${
                            summary.totalTasks
                          } (${getStatus(summary)})`
                        : "Not started"}
                    </TableCell>
                    <TableCell className="text-right flex space-x-2 justify-end">
                      <Link href={`/project/${p._id}`}>
                        <Button className="cursor-pointer">Open</Button>
                      </Link>
                      <DeleteDialog
                        page={"Project"}
                        handleDeleteTask={handleDeleteProject}
                        id={p._id}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <PaginationComp
            paginationDetails={projectPagination}
            setPage={setPage}
            page={page}
          />
        </>
      ) : (
        <EmptyProjectPage />
      )}
    </div>
  );
};

export default FreelancerPage;
