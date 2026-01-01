import UsersList from "./UsersList";
import { User } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminUsersPage() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/admin/users`, { cache: 'no-store' });
    const users: User[] = await res.json();

    return <UsersList initialUsers={users} />;
}
