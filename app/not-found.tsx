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
import { IconError404 } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconError404 />
        </EmptyMedia>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          <Link href={"/"}>
            <Button className="rounded-full">Return Home</Button>
          </Link>
        </div>
        <EmptyDescription>
          Need help?{" "}
          <Link href={``}>
            Contact support
          </Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
