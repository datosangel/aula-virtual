import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EnrollButton } from "@/components/enroll-button";

const LEVEL_LABEL: Record<string, string> = {
  BASICO: "Básico",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
};

export default async function CatalogoPage() {
  const session = await auth();
  const studentId = session!.user.id;

  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLICADO" },
      orderBy: { title: "asc" },
      include: {
        category: true,
        teacher: { select: { name: true } },
        _count: { select: { modules: true } },
      },
    }),
    prisma.enrollment.findMany({
      where: { studentId },
      select: { courseId: true, progressPct: true },
    }),
  ]);

  const enrolledMap = new Map(enrollments.map((e) => [e.courseId, e]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Catálogo de cursos</h1>
        <p className="text-sm text-slate-600">
          {courses.length} curso(s) disponibles. Matricúlate en los que quieras
          llevar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const enrollment = enrolledMap.get(course.id);

          return (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white/90">
                {course.title.charAt(0)}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {course.category && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {course.category.name}
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {LEVEL_LABEL[course.level]}
                  </span>
                </div>

                <p className="font-medium leading-snug">{course.title}</p>
                <p className="line-clamp-2 text-xs text-slate-600">
                  {course.description}
                </p>

                <p className="text-xs text-slate-500">
                  {course.teacher.name} · {course._count.modules} módulo(s)
                  {course.durationHrs ? ` · ${course.durationHrs} h` : ""}
                </p>

                <div className="mt-auto pt-3">
                  {enrollment ? (
                    <Link
                      href={`/alumno/cursos/${course.id}`}
                      className="block rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-center text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {enrollment.progressPct > 0
                        ? `Continuar (${enrollment.progressPct}%)`
                        : "Empezar curso"}
                    </Link>
                  ) : (
                    <EnrollButton courseId={course.id} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Todavía no hay cursos publicados.
        </p>
      )}
    </div>
  );
}
