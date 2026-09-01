"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { uploadBusinessImage } from "@/lib/supabase/storage";
import ImageUploader from "@/components/dashboard/products/ImageUploader";

type Product = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sku: string | null;
  is_available: boolean;
  is_featured: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
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

    const { data: productData, error: productsError } = await supabase
      .from("products")
      .select(
        "id, business_id, name, description, price, image_url, sku, is_available, is_featured"
      )
      .eq("business_id", business.id)
      .order("created_at", { ascending: false });

    if (productsError) {
      setError(productsError.message);
      setLoading(false);
      return;
    }

    setProducts(productData ?? []);
    setLoading(false);
  }

  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setSku("");
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setError("");
  }

  function startEditing(product: Product) {
    setEditingProduct(product);

    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description ?? "");
    setSku(product.sku ?? "");

    setImageFile(null);
    setImagePreview(product.image_url);

    setError("");
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessId) {
      setError("No se encontró tu negocio.");
      return;
    }

    if (!name.trim()) {
      setError("Escribe el nombre del producto.");
      return;
    }

    const numericPrice = Number(price);

    if (!price || Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Introduce un precio válido.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let imageUrl = editingProduct?.image_url ?? null;

      // Si se seleccionó una nueva imagen,
      // primero se comprime y después se sube.
      if (imageFile) {
        const uploadResult = await uploadBusinessImage(
          imageFile,
          businessId,
          "products"
        );

        imageUrl = uploadResult.publicUrl;
      }

      if (editingProduct) {
        // EDITAR PRODUCTO
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name: name.trim(),
            description: description.trim() || null,
            price: numericPrice,
            image_url: imageUrl,
            sku: sku.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)
          .eq("business_id", businessId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        // CREAR PRODUCTO
        const { error: insertError } = await supabase
          .from("products")
          .insert({
            business_id: businessId,
            name: name.trim(),
            description: description.trim() || null,
            price: numericPrice,
            image_url: imageUrl,
            sku: sku.trim() || null,
            is_available: true,
            is_featured: false,
            sort_order: products.length,
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      resetForm();
      setShowForm(false);

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el producto."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .eq("business_id", businessId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadProducts();
  }

  function openNewProductForm() {
    resetForm();
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    resetForm();
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
            Productos
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Administra los productos que aparecerán en tu página web.
          </p>
        </div>

        <button
          onClick={openNewProductForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <span className="text-lg leading-none">+</span>
          Agregar producto
        </button>
      </div>

      {/* ERROR GENERAL */}
      {error && !showForm && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Productos
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Activos
          </p>

          <p className="mt-2 text-3xl font-semibold text-emerald-400">
            {
              products.filter(
                (product) => product.is_available
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Destacados
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {
              products.filter(
                (product) => product.is_featured
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">
            Disponibles
          </p>

          <p className="mt-2 text-3xl font-semibold text-blue-400">
            {
              products.filter(
                (product) => product.is_available
              ).length
            }
          </p>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-semibold text-white">
            Tus productos
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Productos guardados en tu catálogo.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-lime-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-800 text-2xl">
              📦
            </div>

            <h3 className="text-lg font-semibold text-white">
              Aún no tienes productos
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Agrega tu primer producto para comenzar a
              construir el catálogo de tu negocio.
            </p>

            <button
              onClick={openNewProductForm}
              className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Agregar mi primer producto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
              >
                {/* IMAGEN */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>

                {/* INFORMACIÓN */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {product.name}
                    </h3>

                    {product.is_available ? (
                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-400">
                        Disponible
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-xs text-red-400">
                        Oculto
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {product.description}
                    </p>
                  )}

                  <p className="mt-2 text-lg font-semibold text-lime-400">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  {product.sku && (
                    <p className="mt-1 text-xs text-zinc-600">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>

                {/* ACCIONES */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditing(product)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                      onClick={() => {
                          console.log("Botón eliminar presionado:", product.id);
                              deleteProduct(product);
                                }}
                                  className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-lime-400">
                  {editingProduct
                    ? "Editar"
                    : "Nuevo"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  {editingProduct
                    ? "Editar producto"
                    : "Nuevo producto"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {editingProduct
                    ? "Modifica la información de tu producto."
                    : "Completa la información de tu producto."}
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
              {/* IMAGEN */}
              <ImageUploader
                value={imagePreview ?? undefined}
                onChange={(file, preview) => {
                  setImageFile(file);
                  setImagePreview(preview);
                }}
              />

              {/* NOMBRE */}
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Nombre del producto
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ej. Laptop Pro 15"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              {/* PRECIO + SKU */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Precio
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    placeholder="99.99"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    SKU
                  </label>

                  <input
                    type="text"
                    value={sku}
                    onChange={(event) =>
                      setSku(event.target.value)
                    }
                    placeholder="Ej. LAP-001"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Descripción
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe brevemente el producto..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
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
                    : editingProduct
                    ? "Guardar cambios"
                    : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}