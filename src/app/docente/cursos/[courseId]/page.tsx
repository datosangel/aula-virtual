import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadCourseContent } from "@/lib/course-content";
import { ContentEditor } from "@/components/admin/content-editor";

export default async function DocenteCourseContentPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const { courseId } = await params;
  const course = await loadCourseContent(courseId);
  if (!course) notFound();

  // Un docente solo edita el contenido de sus propios cursos.
  if (course.teacherId !== session!.user.id) redirect("/docente/cursos");

  return (
    <ContentEditor
      courseId={course.id}
      courseTitle={course.title}
      modules={course.modules}
      backHref="/docente/cursos"
    />
  );
}
