import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserManager } from "@/components/admin/user-manager";

export default async function UsuariosPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <UserManager
      currentUserId={session!.user.id}
      users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
    />
  );
}
