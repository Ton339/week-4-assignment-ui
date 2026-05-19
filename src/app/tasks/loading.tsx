import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateTaskDialog from "@/components/task/create-task-dialog";

export default function Loading() {
  return (
    <>
      <CreateTaskDialog />
      <div className="w-full max-w-5xl">
        <Table>
          <TableCaption>Loading tasks...</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Task Name</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[20%]">Priority</TableHead>
              <TableHead className="w-[25%]">Assigned To</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-full max-w-[120px] rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-full max-w-[120px] rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
