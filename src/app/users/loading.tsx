import CreateUserDialog from "@/components/user/create-user-dialog";
import { UserCard } from "@/components/user/user-card";

export default function Loading() {
    return (
        <>
            <div className="w-full">
                <div className="flex justify-end mb-4">
                    <CreateUserDialog />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <UserCard user={null} key={index} />
                ))}
            </div>
        </>
    );
}
