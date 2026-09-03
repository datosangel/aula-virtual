"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Lesson = {
  id: string;
  title: string;
  type: string;
  contentUrl: string | null;
  body: string | null;
};

type Module = { id: string; title: string; lessons: Lesson[] };

const LESSON_TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "PDF", label: "PDF" },
  { value: "PRESENTACION", label: "Presentación" },
  { value: "ARCHIVO", label: "Archivo descargable" },
  { value: "LINK_EXTERNO", label: "Enlace externo" },
  { value: "ACTIVIDAD", label: "Actividad" },
];

const TYPE_ICON: Record<string, string> = {
  VIDEO: "▶",
  PDF: "📄",
  PRESENTACION: "📊",
  ARCHIVO: "📎",
  LINK_EXTERNO: "🔗",
  ACTIVIDAD: "📝",
};

export function ContentEditor({
  courseTitle,
  courseId,
  modules,
  backHref,
}: {
  courseTitle: string;
  courseId: string;
  modules: Module[];
  backHref: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newModule, setNewModule] = useState("");
  const [lessonFormFor, setLessonFormFor] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "VIDEO",
    contentUrl: "",
    body: "",
  });

  const refresh = () => startTransition(() => router.refresh());

  const request = async (url: string, method: string, body?: object) => {
    setError(null);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error");
      return false;
    }
    return true;
  };

  const addModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await request("/api/modules", "POST", { courseId, title: newModule })) {
      setNewModule("");
      refresh();
    }
  };

  const renameModule = async (mod: Module) => {
    const title = prompt("Nuevo nombre del módulo:", mod.title);
    if (!title || title === mod.title) return;
    if (await request(`/api/modules/${mod.id}`, "PATCH", { title })) refresh();
  };

  const deleteModule = async (mod: Module) => {
    if (
      !confirm(
        `¿Eliminar el módulo "${mod.title}" y sus ${mod.lessons.length} lección(es)?`
      )
    )
      return;
    if (await request(`/api/modules/${mod.id}`, "DELETE")) refresh();
  };

  const addLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (await request("/api/lessons", "POST", { moduleId, ...lessonForm })) {
      setLessonForm({ title: "", type: "VIDEO", contentUrl: "", body: "" });
      setLessonFormFor(null);
      refresh();
    }
  };

  const deleteLesson = async (lesson: Lesson) => {
    if (!confirm(`¿Eliminar la lección "${lesson.title}"?`)) return;
    if (await request(`/api/lessons/${lesson.id}`, "DELETE")) refresh();
  };

  const field =
    "rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={backHref}
          className="text-xs font-medium text-slate-500 hover:text-indigo-600"
        >
          ← Volver a cursos
        </Link>
        <h1 className="mt-2 text-xl font-bold">{courseTitle}</h1>
        <p className="text-sm text-slate-600">
          {modules.length} módulo(s) ·{" "}
          {modules.reduce((n, m) => n + m.lessons.length, 0)} lección(es)
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={addModule}
        className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <input
          required
          placeholder="Nombre del nuevo módulo (ej. Introducción)"
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          className={`flex-1 ${field}`}
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Añadir módulo
        </button>
      </form>

      <div className="space-y-4">
        {modules.map((mod, i) => (
          <div
            key={mod.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <p className="font-medium">
                <span className="text-slate-400">Módulo {i + 1}:</span>{" "}
                {mod.title}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => renameModule(mod)}
                  className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
                >
                  Renombrar
                </button>
                <button
                  onClick={() => deleteModule(mod)}
                  className="rounded border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <ul className="divide-y divide-slate-100">
              {mod.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm"
                >
                  <span>{TYPE_ICON[lesson.type] ?? "•"}</span>
                  <span className="flex-1">{lesson.title}</span>
                  <span className="text-xs text-slate-400">
                    {LESSON_TYPES.find((t) => t.value === lesson.type)?.label}
                  </span>
                  <button
                    onClick={() => deleteLesson(lesson)}
                    className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
              {mod.lessons.length === 0 && (
                <li className="px-5 py-3 text-sm text-slate-500">
                  Este módulo aún no tiene contenido.
                </li>
              )}
            </ul>

            <div className="border-t border-slate-100 px-5 py-3">
              {lessonFormFor === mod.id ? (
                <form
                  onSubmit={(e) => addLesson(e, mod.id)}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Título de la lección"
                      value={lessonForm.title}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, title: e.target.value })
                      }
                      className={field}
                    />
                    <select
                      value={lessonForm.type}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, type: e.target.value })
                      }
                      className={field}
                    >
                      {LESSON_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {lessonForm.type !== "ACTIVIDAD" && (
                    <input
                      type="url"
                      placeholder="URL del contenido (video, PDF, enlace...)"
                      value={lessonForm.contentUrl}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          contentUrl: e.target.value,
                        })
                      }
                      className={`w-full ${field}`}
                    />
                  )}

                  <textarea
                    rows={2}
                    placeholder="Descripción o instrucciones (opcional)"
                    value={lessonForm.body}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, body: e.target.value })
                    }
                    className={`w-full ${field}`}
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                    >
                      Guardar lección
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonFormFor(null)}
                      className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setLessonFormFor(mod.id);
                    setLessonForm({
                      title: "",
                      type: "VIDEO",
                      contentUrl: "",
                      body: "",
                    });
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  + Añadir contenido
                </button>
              )}
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            Este curso aún no tiene módulos. Añade el primero arriba.
          </p>
        )}
      </div>
    </div>
  );
}
