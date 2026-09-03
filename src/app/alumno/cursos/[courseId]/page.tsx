import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseSidebar } from "@/components/course-player/course-sidebar";
import { LessonViewer } from "@/components/course-player/lesson-viewer";

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ leccion?: string }>;
}) {
  const session = await auth();
  const { courseId } = await params;
  const { leccion } = await searchParams;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_studentId: { courseId, studentId: session!.user.id },
    },
  });
  if (!enrollment) redirect("/alumno");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: { where: { studentId: session!.user.id } },
            },
          },
        },
      },
    },
  });
  if (!course) notFound();

  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) notFound();

  const activeLesson =
    allLessons.find((l) => l.id === leccion) ?? allLessons[0];

  const modulesForSidebar = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      type: l.type,
      completed: l.progress[0]?.completed ?? false,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <CourseSidebar
        courseId={course.id}
        modules={modulesForSidebar}
        activeLessonId={activeLesson.id}
        progressPct={enrollment.progressPct}
      />
      <main className="flex-1 bg-slate-50">
        <LessonViewer
          lesson={activeLesson}
          completed={activeLesson.progress[0]?.completed ?? false}
          watermarkText={`${session!.user.name} · ${session!.user.email}`}
        />
      </main>
    </div>
  );
}
