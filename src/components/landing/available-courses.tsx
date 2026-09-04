import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const LEVEL_LABEL: Record<string, string> = {
  BASICO: "Nivel básico",
  INTERMEDIO: "Nivel intermedio",
  AVANZADO: "Nivel avanzado",
};

export async function AvailableCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLICADO" },
    include: { category: true, teacher: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  if (courses.length === 0) return null;

  return (
    <section id="cursos-disponibles" className="mx-auto max-w-[1000px] px-4 py-12 md:px-8">
      <h2 className="font-accent text-2xl font-semibold text-[#013C9A] md:text-3xl">
        Cursos disponibles
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {courses.map((course) => (
          <article
            key={course.id}
            className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
          >
            {course.imageUrl && (
              <div className="relative h-56 w-full md:h-72">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-5 md:p-6">
              <Link
                href="/login"
                className="text-lg font-semibold text-[#013C9A] underline-offset-2 hover:underline md:text-xl"
              >
                {course.title}
              </Link>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#013C9A]/10 px-3 py-1 text-xs font-medium text-[#013C9A]">
                  {LEVEL_LABEL[course.level] ?? course.level}
                </span>
                {course.durationHrs && (
                  <span className="rounded-full bg-[#3BB546]/10 px-3 py-1 text-xs font-medium text-[#2E8C37]">
                    {course.durationHrs} h de duración
                  </span>
                )}
                {course.category && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {course.category.name}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                {course.description}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Docente: {course.teacher.name}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="rounded-lg bg-[#013C9A] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Ver curso
                </Link>
                <Link
                  href="/registro"
                  className="rounded-lg border border-[#3BB546] px-5 py-2.5 text-center text-sm font-semibold text-[#2E8C37] transition hover:bg-[#3BB546]/10"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
