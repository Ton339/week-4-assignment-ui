import BackButton from "@/components/back-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "View and manage tasks",
};

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <BackButton className="mb-4" />
      <h1 className="text-4xl font-bold text-center mb-8">Tasks</h1>
      <div className="w-full mb-8">
        {children}
      </div>
    </div>
  );
}
