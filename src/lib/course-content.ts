import { prisma } from "@/lib/prisma";

/** Carga un curso con sus módulos y lecciones ordenados, para el editor. */
export async function loadCourseContent(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    teacherId: course.teacherId,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        contentUrl: l.contentUrl,
        body: l.body,
      })),
    })),
  };
}
