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

const ClientPage = () => {
  const { projects, setProjects } = useProjectStore();
  const [projectSummary, setProjectSummary] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch(`/api/project`);
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data.projects);
    };
    fetchProjects();
  }, [setProjects]);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(
        `/api/project/summary`
      );
      if (!res.ok) return;
      const data = await res.json();
      setProjectSummary(data);
    };
    fetchSummary();
  }, []);

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

  return (
    <div className="max-w-10/12 w-full mx-auto py-[5%]">
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
                      PRO{(idx + 1).toString().padStart(3, "0")}
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
                      <Link
                        href={`/project/${p._id}`}
                      >
                        <Button>Open</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </> 
        ): <EmptyProjectPage />
}
    </div>
  );
};

export default ClientPage;
