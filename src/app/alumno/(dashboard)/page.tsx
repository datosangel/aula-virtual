import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";

export default async function AlumnoDashboard() {
  const session = await auth();
  const studentId = session!.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: { course: true },
  });

  const pendingAssignments = await prisma.assignment.count({
    where: {
      module: { course: { enrollments: { some: { studentId } } } },
      submissions: { none: { studentId } },
    },
  });

  const avgProgress =
    enrollments.reduce((sum, e) => sum + e.progressPct, 0) /
    (enrollments.length || 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Mi panel</h1>
        <p className="text-sm text-slate-600">
          Bienvenido/a, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Cursos inscritos" value={enrollments.length} />
        <StatCard label="Progreso promedio" value={`${Math.round(avgProgress)}%`} />
        <StatCard label="Actividades pendientes" value={pendingAssignments} />
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Mis cursos</h2>

        {enrollments.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            Aún no estás inscrito en ningún curso.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <Link
                key={e.id}
                href={`/alumno/cursos/${e.courseId}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white/90">
                  {e.course.title.charAt(0)}
                </div>
                <div className="space-y-2 p-4">
                  <p className="font-medium leading-snug group-hover:text-indigo-600">
                    {e.course.title}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${e.progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {e.progressPct}% completado
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
