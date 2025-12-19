"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { IconBug } from "@tabler/icons-react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Empty>
      <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconBug />
          </EmptyMedia>
        <EmptyTitle>Something went Wrong</EmptyTitle>
        <EmptyDescription>
          It looks like thier are some error occur
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex space-x-2">
          <Button onClick={() => reset()} variant={"outline"}>
            Try Again
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
