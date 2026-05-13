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
    <>
      <BackButton className="mb-4" />
      <h1 className="text-4xl font-bold">Tasks</h1>
      <div className="container w-full px-12 py-4 justify-items-center mb-8">
        {children}
      </div>
    </>
  );
}
