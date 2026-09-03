import { auth } from "@/lib/auth";
import { loadCourseManagerData } from "@/lib/courses";
import { CourseManager } from "@/components/admin/course-manager";

export default async function AdminCursosPage() {
  const session = await auth();
  const { courses, teachers, categories } = await loadCourseManagerData();

  return (
    <CourseManager
      courses={courses}
      teachers={teachers}
      categories={categories}
      canAssignTeacher
      defaultTeacherId={session!.user.id}
      editorBasePath="/admin/cursos"
    />
  );
}
