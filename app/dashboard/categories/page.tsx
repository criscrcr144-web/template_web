"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Category = {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("No se pudo identificar al usuario.");
      setLoading(false);
      return;
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (businessError || !business) {
      setError("No se encontró el negocio asociado a tu cuenta.");
      setLoading(false);
      return;
    }

    setBusinessId(business.id);

    const { data, error: categoriesError } = await supabase
      .from("categories")
      .select("id, business_id, name, slug, sort_order")
      .eq("business_id", business.id)
      .order("sort_order", { ascending: true });

    if (categoriesError) {
      setError(categoriesError.message);
      setLoading(false);
      return;
    }

    setCategories(data ?? []);
    setLoading(false);
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function resetForm() {
    setName("");
    setEditingCategory(null);
    setError("");
  }

  function openNewCategoryForm() {
    resetForm();
    setShowForm(true);
  }

  function startEditing(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessId) {
      setError("No se encontró tu negocio.");
      return;
    }

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Escribe el nombre de la categoría.");
      return;
    }

    const slug = createSlug(cleanName);

    if (!slug) {
      setError("El nombre de la categoría no es válido.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        const { error: updateError } = await supabase
          .from("categories")
          .update({
            name: cleanName,
            slug,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategory.id)
          .eq("business_id", businessId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("categories")
          .insert({
            business_id: businessId,
            name: cleanName,
            slug,
            sort_order: categories.length,
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      setShowForm(false);
      resetForm();

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la categoría."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    if (!businessId) {
      setError("No se encontró tu negocio.");
      return;
    }

    setError("");

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id)
      .eq("business_id", businessId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (item) => item.id !== category.id
      )
    );
  }

  function handleDeleteClick(category: Category) {
    deleteCategory(category);
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-lime-400">
            ADMINISTRACIÓN
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Categorías
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Organiza los productos de tu página web.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewCategoryForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <span className="text-lg leading-none">+</span>
          Agregar categoría
        </button>
      </div>

      {/* ERROR GENERAL */}
      {error && !showForm && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Categorías
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {categories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Organización
          </p>

          <p className="mt-2 text-sm font-medium text-lime-400">
            Orden personalizado
          </p>
        </div>
      </div>

      {/* LISTA */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-semibold text-white">
            Tus categorías
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Estas categorías estarán disponibles para organizar
            tus productos.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-lime-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-800 text-2xl">
              📂
            </div>

            <h3 className="text-lg font-semibold text-white">
              Aún no tienes categorías
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Crea categorías para organizar fácilmente los
              productos de tu catálogo.
            </p>

            <button
              type="button"
              onClick={openNewCategoryForm}
              className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Crear mi primera categoría
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                {/* NÚMERO */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-zinc-400">
                  {index + 1}
                </div>

                {/* INFORMACIÓN */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-600">
                    /{category.slug}
                  </p>
                </div>

                {/* ACCIONES */}
                <div className="relative z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(category)}
                    className="pointer-events-auto rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(category)}
                    className="pointer-events-auto rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-lime-400">
                  {editingCategory ? "Editar" : "Nueva"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  {editingCategory
                    ? "Editar categoría"
                    : "Nueva categoría"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {editingCategory
                    ? "Modifica el nombre de tu categoría."
                    : "Crea una categoría para organizar tus productos."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* FORMULARIO */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Nombre de la categoría
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ej. Hamburguesas"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  La dirección se generará automáticamente.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* BOTONES */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Guardando..."
                    : editingCategory
                    ? "Guardar cambios"
                    : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}