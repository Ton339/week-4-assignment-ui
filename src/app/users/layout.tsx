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
    <>
      <BackButton className="mb-4" />
      <h1 className="text-4xl font-bold pb-6">User List</h1>
      {children}
    </>
  );
}
