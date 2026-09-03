import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SidebarLink } from "@/components/sidebar-link";
import { UserMenu } from "@/components/user-menu";
import {
  IconAyuda,
  IconCalendario,
  IconCampana,
  IconCertificado,
  IconChat,
  IconConfiguracion,
  IconCursos,
  IconUsuarios,
} from "@/components/nav-icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactElement;
};

const ICON_CLASS = "h-6 w-6";

/** Sección de cursos propia de cada rol; el resto de la navegación es común. */
const COURSES_HOME: Record<string, string> = {
  ADMIN: "/admin",
  DOCENTE: "/docente",
  ALUMNO: "/alumno",
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  ALUMNO: "Estudiante",
};

function navFor(role: string): NavItem[] {
  const items: NavItem[] = [
    {
      href: COURSES_HOME[role],
      label: "Cursos",
      icon: <IconCursos className={ICON_CLASS} />,
    },
  ];

  if (role === "ADMIN") {
    items.push({
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: <IconUsuarios className={ICON_CLASS} />,
    });
  }
  if (role === "ALUMNO") {
    items.push({
      href: "/alumno/certificados",
      label: "Certificados",
      icon: <IconCertificado className={ICON_CLASS} />,
    });
  }

  items.push(
    { href: "/chat", label: "Chat", icon: <IconChat className={ICON_CLASS} /> },
    {
      href: "/calendario",
      label: "Calendario",
      icon: <IconCalendario className={ICON_CLASS} />,
    },
    { href: "/ayuda", label: "Ayuda", icon: <IconAyuda className={ICON_CLASS} /> },
    {
      href: "/perfil",
      label: "Configuración",
      icon: <IconConfiguracion className={ICON_CLASS} />,
    }
  );

  return items;
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session!.user.role;

  const [user, unreadMessages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { name: true, avatarUrl: true },
    }),
    prisma.message.count({
      where: { recipientId: session!.user.id, readAt: null },
    }),
  ]);

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-screen bg-[#eef4fd]">
      {/* ---------- Barra lateral de iconos ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[72px] flex-col bg-[#0b1b3a] sm:w-[88px]">
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <Link href={COURSES_HOME[role]} className="text-lg font-bold text-white">
            AV
          </Link>
        </div>

        <nav className="flex flex-1 flex-col py-2">
          {navFor(role).map((item) => (
            <SidebarLink key={item.href} href={item.href} label={item.label}>
              {item.icon}
            </SidebarLink>
          ))}
        </nav>
      </aside>

      {/* ---------- Contenido ---------- */}
      <div className="flex min-h-screen flex-1 flex-col pl-[72px] sm:pl-[88px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-5 border-b border-slate-200 bg-white px-4 sm:px-8">
          <Link
            href="/chat"
            aria-label={`Mensajes sin leer: ${unreadMessages}`}
            className="relative text-slate-500 transition hover:text-indigo-600"
          >
            <IconCampana className="h-6 w-6" />
            {unreadMessages > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadMessages}
              </span>
            )}
          </Link>

          <div className="h-8 w-px bg-slate-200" />

          <UserMenu
            name={user?.name ?? ""}
            firstName={firstName}
            roleLabel={ROLE_LABEL[role]}
            avatarUrl={user?.avatarUrl ?? null}
          />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
