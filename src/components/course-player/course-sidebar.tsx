import Link from "next/link";

type LessonItem = {
  id: string;
  title: string;
  type: string;
  completed: boolean;
};

type ModuleItem = {
  id: string;
  title: string;
  lessons: LessonItem[];
};

const TYPE_ICON: Record<string, string> = {
  VIDEO: "▶",
  PDF: "📄",
  PRESENTACION: "📊",
  ARCHIVO: "📎",
  LINK_EXTERNO: "🔗",
  ACTIVIDAD: "📝",
};

export function CourseSidebar({
  courseId,
  modules,
  activeLessonId,
  progressPct,
}: {
  courseId: string;
  modules: ModuleItem[];
  activeLessonId: string;
  progressPct: number;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-slate-200 bg-white sm:w-80">
      <div className="border-b border-slate-200 p-4">
        <Link
          href="/alumno"
          className="text-xs font-medium text-slate-500 hover:text-indigo-600"
        >
          ← Volver a mis cursos
        </Link>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>Progreso</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {modules.map((mod, i) => (
          <div key={mod.id} className="border-b border-slate-100">
            <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Módulo {i + 1}: {mod.title}
            </p>
            <ul>
              {mod.lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/alumno/cursos/${courseId}?leccion=${lesson.id}`}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "border-l-2 border-indigo-600 bg-indigo-50 font-medium text-indigo-700"
                          : "border-l-2 border-transparent text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base leading-none">
                        {TYPE_ICON[lesson.type] ?? "•"}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      {lesson.completed && (
                        <span className="text-green-600" title="Completada">
                          ✓
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
