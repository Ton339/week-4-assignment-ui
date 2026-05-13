"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button className={className} onClick={() => router.back()}>
      Back
    </Button>
  );
}
