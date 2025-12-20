"use client";
import { useEffect, useMemo, useState } from "react";
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
import Link from "next/link";
import { useProjectStore } from "@/store/useProjectStore";
import EmptyProjectPage from "../layout/emptyProjectPage";
import PaginationComp from "../layout/pagination";
import Loader from "../ui/loader";

const ClientPage = () => {
  const { projects, setProjects } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [projectSummary, setProjectSummary] = useState<any[]>([]);
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

      const res = await fetch(`/api/project?page=${page}&limit=10`);
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
      setProjectSummary(data.summary);
      setProjectPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [page, setProjects]);

  const summaryMap = useMemo(() => {
    return projectSummary.reduce((acc: any, item: any) => {
      acc[item.projectId.toString()] = item;
      return acc;
    }, {});
  }, [projectSummary]);
  const getStatus = (summary: any) => {
    if (!summary || summary.totalTasks === 0) return "Not started";
    if (summary.completedTasks === summary.totalTasks) return "Completed";
    return "In progress";
  };
  if (loading) {
    return <Loader text="Fetching Projects" />;
  }
  return (
    <div className="md:max-w-10/12 px-2 w-full mx-auto py-[5%]">
      {projects.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of assigned project.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Freelancer Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p, idx) => {
                const summary = summaryMap[p._id.toString()];
                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      PRO
                      {((page - 1) * 10 + idx + 1).toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.freelancerId}</TableCell>
                    <TableCell>
                      {summary
                        ? `${summary.completedTasks} / ${
                            summary.totalTasks
                          } (${getStatus(summary)})`
                        : "Not started"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/project/${p._id}`}>
                        <Button>Open</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <PaginationComp
            paginationDetails={projectPagination}
            page={page}
            setPage={setPage}
          />
        </>
      ) : (
        <EmptyProjectPage />
      )}
    </div>
  );
};

export default ClientPage;
