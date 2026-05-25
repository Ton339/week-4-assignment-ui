import { UserCard } from "@/components/user/user-card";
import { User } from "./user";
import Link from "next/link";
import CreateUserDialog from "@/components/user/create-user-dialog";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getUsers(): Promise<User[]> {
  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API_URL}/user`, { cache: 'no-store' });
    await sleep(1000);
    if (!res.ok) {
      console.warn(`Users API returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch users error:", error);
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  if (users.length === 0) {
    return (
      <>
        <div className="w-full">
          <div className="flex justify-end ">
            <CreateUserDialog />
          </div>
        </div>
        <h1 className="justify-self-center text-4xl font-bold">No users found</h1>
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <CreateUserDialog />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </>
  );
}
