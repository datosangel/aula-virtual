import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";

export default async function DocenteDashboard() {
  const session = await auth();
  const teacherId = session!.user.id;

  const courses = await prisma.course.findMany({
    where: { teacherId },
    include: {
      enrollments: true,
      modules: {
        include: { assignments: { include: { submissions: true } } },
      },
    },
  });

  const totalStudents = new Set(
    courses.flatMap((c) => c.enrollments.map((e) => e.studentId))
  ).size;

  const avgProgress =
    courses.flatMap((c) => c.enrollments).reduce((sum, e) => sum + e.progressPct, 0) /
    (courses.flatMap((c) => c.enrollments).length || 1);

  const pendingSubmissions = courses
    .flatMap((c) => c.modules)
    .flatMap((m) => m.assignments)
    .flatMap((a) => a.submissions)
    .filter((s) => s.status === "ENTREGADO").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Panel del docente</h1>
        <p className="text-sm text-slate-600">
          {courses.length} curso(s) a tu cargo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Alumnos" value={totalStudents} />
        <StatCard label="Avance promedio" value={`${Math.round(avgProgress)}%`} />
        <StatCard label="Entregas por revisar" value={pendingSubmissions} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Mis cursos</h2>
        <ul className="divide-y divide-slate-100">
          {courses.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <span>{c.title}</span>
              <span className="text-sm text-slate-500">
                {c.enrollments.length} alumno(s)
              </span>
            </li>
          ))}
          {courses.length === 0 && (
            <li className="py-2 text-sm text-slate-500">
              Aún no tienes cursos asignados.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
