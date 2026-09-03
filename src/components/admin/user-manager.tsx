"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
};

const ROLES = ["ADMIN", "DOCENTE", "ALUMNO"] as const;
const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  ALUMNO: "Alumno",
};

export function UserManager({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulario de creación
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ALUMNO",
  });
  // Formulario de edición en línea
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await request("/api/users", "POST", form)) {
      setForm({ name: "", email: "", password: "", role: "ALUMNO" });
      setCreating(false);
      refresh();
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleSaveEdit = async (id: string) => {
    if (await request(`/api/users/${id}`, "PATCH", editForm)) {
      setEditingId(null);
      refresh();
    }
  };

  const handleToggleActive = async (user: User) => {
    if (await request(`/api/users/${user.id}`, "PATCH", { active: !user.active })) {
      refresh();
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`))
      return;
    if (await request(`/api/users/${user.id}`, "DELETE")) refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Usuarios</h1>
          <p className="text-sm text-slate-600">
            {users.length} usuario(s) registrados
          </p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          {creating ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {creating && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            required
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <input
            required
            type="password"
            minLength={8}
            placeholder="Contraseña (mín. 8)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Crear usuario
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isEditing = editingId === user.id;

              return (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 px-2 py-1"
                      />
                    ) : (
                      <span className="font-medium">
                        {user.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-slate-400">
                            (tú)
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 px-2 py-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing && !isSelf ? (
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="rounded border border-slate-300 px-2 py-1"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {ROLE_LABEL[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded border border-slate-300 px-3 py-1 text-xs"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          {!isSelf && (
                            <>
                              <button
                                onClick={() => handleToggleActive(user)}
                                className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
                              >
                                {user.active ? "Desactivar" : "Activar"}
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="rounded border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
