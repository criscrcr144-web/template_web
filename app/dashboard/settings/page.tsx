"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { uploadBusinessImage } from "@/lib/supabase/storage";
import ImageUploader from "@/components/dashboard/products/ImageUploader";

type Business = {
  id: string;
  name: string;
  description: string | null;
  whatsapp: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  cover_url: string | null;
  primary_color: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
};

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [primaryColor, setPrimaryColor] = useState("#bef264");

  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
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

    const { data, error: businessError } = await supabase
      .from("businesses")
      .select(
        "id, name, description, whatsapp, phone, address, logo_url, cover_url, primary_color, instagram_url, facebook_url, tiktok_url"
      )
      .eq("owner_id", user.id)
      .single();

    if (businessError || !data) {
      setError("No se encontró el negocio asociado a tu cuenta.");
      setLoading(false);
      return;
    }

    setBusiness(data);
    setBusinessId(data.id);

    setName(data.name ?? "");
    setDescription(data.description ?? "");
    setWhatsapp(data.whatsapp ?? "");
    setPhone(data.phone ?? "");
    setAddress(data.address ?? "");

    setPrimaryColor(data.primary_color ?? "#bef264");

    setInstagramUrl(data.instagram_url ?? "");
    setFacebookUrl(data.facebook_url ?? "");
    setTiktokUrl(data.tiktok_url ?? "");

    setLogoPreview(data.logo_url);
    setCoverPreview(data.cover_url);

    setLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessId) {
      setError("No se encontró tu negocio.");
      return;
    }

    const cleanName = name.trim();

    if (!cleanName) {
      setError("El nombre del negocio es obligatorio.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let logoUrl = business?.logo_url ?? null;
      let coverUrl = business?.cover_url ?? null;

      if (logoFile) {
        const uploadResult = await uploadBusinessImage(
          logoFile,
          businessId,
          "business"
        );

        logoUrl = uploadResult.publicUrl;
      }

      if (coverFile) {
        const uploadResult = await uploadBusinessImage(
          coverFile,
          businessId,
          "business"
        );

        coverUrl = uploadResult.publicUrl;
      }

      const { data, error: updateError } = await supabase
        .from("businesses")
        .update({
          name: cleanName,
          description: description.trim() || null,
          whatsapp: whatsapp.trim() || null,
          phone: phone.trim() || null,
          address: address.trim() || null,
          logo_url: logoUrl,
          cover_url: coverUrl,
          primary_color: primaryColor,
          instagram_url: instagramUrl.trim() || null,
          facebook_url: facebookUrl.trim() || null,
          tiktok_url: tiktokUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)
        .select(
          "id, name, description, whatsapp, phone, address, logo_url, cover_url, primary_color, instagram_url, facebook_url, tiktok_url"
        )
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      setBusiness(data);

      setLogoFile(null);
      setCoverFile(null);

      setLogoPreview(data.logo_url);
      setCoverPreview(data.cover_url);

      setSuccess("La configuración se guardó correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la configuración."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-lime-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-lime-400">
          ADMINISTRACIÓN
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Configuración
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Personaliza la información que aparecerá en la página
          pública de tu negocio.
        </p>
      </div>

      {/* MENSAJES */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INFORMACIÓN */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-semibold text-white">
              Información del negocio
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Estos datos aparecerán en tu página pública.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Nombre del negocio
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ej. Mi Restaurante"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

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
                placeholder="Cuéntales brevemente a tus clientes sobre tu negocio..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  WhatsApp
                </label>

                <input
                  type="text"
                  value={whatsapp}
                  onChange={(event) =>
                    setWhatsapp(event.target.value)
                  }
                  placeholder="Ej. 584121234567"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Incluye el código de país.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Teléfono
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Ej. +58 412 1234567"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Dirección
              </label>

              <input
                type="text"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Ej. Av. Principal, Local 5"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
          </div>
        </section>

        {/* IMÁGENES */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-semibold text-white">
              Imágenes
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Agrega el logo y la imagen principal de tu negocio.
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-3 block text-sm text-zinc-300">
                Logo
              </label>

              <ImageUploader
                value={logoPreview ?? undefined}
                onChange={(file, preview) => {
                  setLogoFile(file);
                  setLogoPreview(preview);
                }}
              />
            </div>

            <div>
              <label className="mb-3 block text-sm text-zinc-300">
                Imagen principal
              </label>

              <ImageUploader
                value={coverPreview ?? undefined}
                onChange={(file, preview) => {
                  setCoverFile(file);
                  setCoverPreview(preview);
                }}
              />
            </div>
          </div>
        </section>
          {/* DISEÑO */}
                <section className="rounded-2xl border border-white/10 bg-zinc-900/70">
                  <div className="border-b border-white/10 px-6 py-5">
                    <h2 className="font-semibold text-white">
                      Diseño
                    </h2>
        
                    <p className="mt-1 text-sm text-zinc-500">
                      Elige el color principal de tu página.
                    </p>
                  </div>
        
                  <div className="p-6">
                    <label className="mb-3 block text-sm text-zinc-300">
                      Color principal
                    </label>
        
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(event) =>
                          setPrimaryColor(event.target.value)
                        }
                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                      />
        
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(event) =>
                          setPrimaryColor(event.target.value)
                        }
                        placeholder="#bef264"
                        className="w-40 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                      />
        
                      <div
                        className="h-10 w-10 rounded-full border border-white/10"
                        style={{
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                  </div>
                </section>
        
                {/* REDES SOCIALES */}
                <section className="rounded-2xl border border-white/10 bg-zinc-900/70">
                  <div className="border-b border-white/10 px-6 py-5">
                    <h2 className="font-semibold text-white">
                      Redes sociales
                    </h2>
        
                    <p className="mt-1 text-sm text-zinc-500">
                      Agrega los enlaces de tus redes sociales.
                    </p>
                  </div>
        
                  <div className="space-y-5 p-6">
                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">
                        Instagram
                      </label>
        
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={(event) =>
                          setInstagramUrl(event.target.value)
                        }
                        placeholder="https://instagram.com/tu_negocio"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                      />
                    </div>
        
                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">
                        Facebook
                      </label>
        
                      <input
                        type="url"
                        value={facebookUrl}
                        onChange={(event) =>
                          setFacebookUrl(event.target.value)
                        }
                        placeholder="https://facebook.com/tu_negocio"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                      />
                    </div>
        
                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">
                        TikTok
                      </label>
        
                      <input
                        type="url"
                        value={tiktokUrl}
                        onChange={(event) =>
                          setTiktokUrl(event.target.value)
                        }
                        placeholder="https://tiktok.com/@tu_negocio"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                      />
                    </div>
                  </div>
                </section>
        
                {/* GUARDAR */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          );
        }