"use client";
import { useState, useEffect, useCallback } from "react";
import { UserCard } from "@/components/user-card";
import { User } from "./user";
import Link from "next/link";
import { ErrorCard } from "@/components/error-card";
import CreateUserDialog from "@/components/user/create-user-dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 trigger refetch

  const fetchUsers = useCallback(async (isRefetch = false) => {
    try {
      if (isRefetch) setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);

      if (!res.ok) {
        console.warn(`Users API returned ${res.status}`);
        setUsers([]); // Clear users or keep empty
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Logic lives inside the effect — linter is happy
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);

        if (!res.ok) {
          console.warn(`Users API returned ${res.status}`);
          setUsers([]);
          return;
        }

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch users error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]); // 👈 re-runs when refreshKey changes

  const refetch = () => setRefreshKey((k) => k + 1); // 👈 stable, no setState in effect


  // กรณีที่ 1: กำลังโหลด (Pending)
  if (loading) {
    return (
      <>
        <div className="grid grid-cols-3  gap-4">
          {
            Array.from({ length: 9 }).map((_, i) => (
              <UserCard key={i} user={null} />
            ))
          }
        </div>
      </>
    );
  }

  // กรณีที่ 2: เกิดข้อผิดพลาด (Rejected)
  if (error) {
    return <ErrorCard />;
  }

  if (users.length === 0) {
    return (
      <>
        <div className="w-full">
          <div className="flex justify-end ">
            <CreateUserDialog onSuccess={() => fetchUsers(true)} />
          </div>
        </div>
        <h1 className="justify-self-center text-4xl font-bold">No users found</h1>
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-end">
          <CreateUserDialog onSuccess={refetch} /> {/* 👈 */}
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
