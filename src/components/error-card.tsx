
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function ErrorCard({ error }: { error: Error }) {
  const router = useRouter();
  function handleReset() {
    router.refresh();
  }
  return (
    <Card className="w-lg p-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2 text-red-500">
          <AlertCircle size={40} />
        </div>
        <CardTitle className="text-red-700 dark:text-red-400">
          Something went wrong!
        </CardTitle>
        <CardDescription className="text-red-600/80 dark:text-red-400/80">
          {error.message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-4">
        <Button variant="destructive" onClick={handleReset}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
