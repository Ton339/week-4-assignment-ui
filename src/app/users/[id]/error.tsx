"use client";

import { ErrorCard } from "@/components/error-card";

export default function Error({
  error
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex justify-center items-center h-screen">
      <ErrorCard error={error} />
    </div>
  );
}
