import BackButton from "@/components/back-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your dashboard and statistics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackButton className="mb-4" />
      {children}
    </>
  );
}
