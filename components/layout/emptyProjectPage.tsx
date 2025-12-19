"use client";
import { IconFolderCode } from "@tabler/icons-react";
import {  Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { useSession } from "next-auth/react";
const EmptyProjectPage = () => {
  const { data: session } = useSession();
  return (
    <Empty>
      {session?.user.role === "Client" ? (
        <EmptyTitle>No Project Found</EmptyTitle>
      ) : (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconFolderCode />
            </EmptyMedia>
            <EmptyTitle>No Project Found</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any project yet.Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href={`/project/create`}>
                <Button>
                  <Plus />
                  Create Project
                </Button>
              </Link>
            </div>
          </EmptyContent>
        </>
      )}
    </Empty>
  );
};

export default EmptyProjectPage;
