import BackButton from "@/components/back-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "View and manage users",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto pb-4">
      <BackButton className="mb-4" />
      <h1 className="text-4xl font-bold text-center pb-6">User List</h1>
      {children}
    </div>
  );
}
