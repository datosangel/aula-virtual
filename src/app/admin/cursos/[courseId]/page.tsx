import { notFound } from "next/navigation";
import { loadCourseContent } from "@/lib/course-content";
import { ContentEditor } from "@/components/admin/content-editor";

export default async function AdminCourseContentPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await loadCourseContent(courseId);
  if (!course) notFound();

  return (
    <ContentEditor
      courseId={course.id}
      courseTitle={course.title}
      modules={course.modules}
      backHref="/admin/cursos"
    />
  );
}
