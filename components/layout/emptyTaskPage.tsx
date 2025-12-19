"use client";

import { IconChecklist } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useSession } from "next-auth/react";
const EmptyTaskPage = () => {
  const { data: session } = useSession();

  return (
    <Empty>
      {session?.user.role === "Client" ? (
        <EmptyTitle>No Task Found</EmptyTitle>
      ) : (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconChecklist />
            </EmptyMedia>
            <EmptyTitle>No Task Found</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any task yet.
            </EmptyDescription>
          </EmptyHeader>
        </>
      )}
    </Empty>
  );
};

export default EmptyTaskPage;
