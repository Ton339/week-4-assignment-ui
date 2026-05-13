import { DeleteUserDialog } from "@/components/user/delete-user-dialog";
import { User } from "../user";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdateUserDialog from "@/components/user/update-user-dialog";
import Image from "next/image";

const roleColors: Record<string, string> = {
  Admin: "bg-blue-50 text-blue-700 dark:bg-sky-950 dark:text-sky-300",
  Editor: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  User: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  Inactive: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<import("next").Metadata> {
  const { id } = await params;
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API_URL}/user/${id}`);
    if (res.ok) {
      const user: User = await res.json();
      return {
        title: user.name,
        description: user.email,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {
    title: "User Profile",
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch user data using the id
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/user/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.tsx` Error Boundary
    throw new Error(`Failed to fetch user data (Status: ${res.status})`);
  }

  const user: User = await res.json();

  return (
    <>
      <div className="container w-full px-12 py-4 justify-items-center">

        <div className="w-full max-w-lg mx-auto">
          <Card className="w-lg flex-row items-center p-4 gap-4 hover:scale-105 transition-transform">
            <Image
              src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=unkown"}
              alt={user.name}
              width={500}
              height={500}
              loading="eager"
              className="w-50 h-50 rounded-full object-cover"
            />
            <div className="flex-1">
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <div className="gap-2 mt-2">
                  <p>
                    role :{" "}
                    <Badge
                      variant={"secondary"}
                      className={roleColors[user.role]}
                    >
                      {user.role}
                    </Badge>
                  </p>
                  <p>
                    status :{" "}
                    <Badge
                      variant={"secondary"}
                      className={statusColors[user.status]}
                    >
                      {user.status}
                    </Badge>
                  </p>
                  <p>address : {user.address}</p>
                  <p>birthdate : {user.birthdate}</p>
                  <p>phone : {user.phone}</p>
                  <p>occupation : {user.occupation}</p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
        <div className="flex gap-8 pt-8">
          <UpdateUserDialog user={user} />
          <DeleteUserDialog user={user} />
        </div>
      </div>
    </>
  );
}
