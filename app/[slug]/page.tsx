import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sku: string | null;
  is_available: boolean;
  is_featured: boolean;
};

export default async function PublicCatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient();

  // --------------------------------------------------
  // BUSCAR NEGOCIO
  // --------------------------------------------------

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select(`
      id,
      name,
      description,
      whatsapp,
      phone,
      address,
      logo_url,
      cover_url,
      primary_color,
      instagram_url,
      facebook_url,
      tiktok_url
    `)
    .eq("slug", slug)
    .single();

  if (businessError || !business) {
    notFound();
  }

  // --------------------------------------------------
  // BUSCAR CATEGORÍAS
  // --------------------------------------------------

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("business_id", business.id)
    .order("name", { ascending: true });

  // --------------------------------------------------
  // BUSCAR PRODUCTOS
  // --------------------------------------------------

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      business_id,
      category_id,
      name,
      slug,
      description,
      price,
      image_url,
      sku,
      is_available,
      is_featured
    `)
    .eq("business_id", business.id)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const businessData = business as Business;
  const categoryData = (categories || []) as Category[];
  const productData = (products || []) as Product[];

  const primaryColor =
    businessData.primary_color || "#a3e635";

  // --------------------------------------------------
  // PRODUCTOS DESTACADOS
  // --------------------------------------------------

  const featuredProducts = productData.filter(
    (product) => product.is_featured && product.is_available
  );

  // --------------------------------------------------
  // PRODUCTOS DISPONIBLES
  // --------------------------------------------------

  const availableProducts = productData.filter(
    (product) => product.is_available
  );

  return (
    <main
      className="min-h-screen bg-[#070b12] text-white"
      style={
        {
          "--primary-color": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">
        {businessData.cover_url ? (
          <div className="absolute inset-0">
            <Image
              src={businessData.cover_url}
              alt={businessData.name}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#070b12]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#090d15] to-[#070b12]" />
        )}

        <div className="relative mx-auto flex min-h-[430px] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center">
          {/* LOGO */}

          <div className="mb-6">
            {businessData.logo_url ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/20 bg-black/40 shadow-2xl">
                <Image
                  src={businessData.logo_url}
                  alt={businessData.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/10 bg-white/10 text-4xl font-bold shadow-2xl"
                style={{ color: primaryColor }}
              >
                {businessData.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* NOMBRE */}

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {businessData.name}
          </h1>

          {/* DESCRIPCIÓN */}

          {businessData.description && (
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              {businessData.description}
            </p>
          )}

          {/* INFORMACIÓN */}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-white/70">
            {businessData.phone && (
              <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur">
                📞 {businessData.phone}
              </span>
            )}

            {businessData.address && (
              <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur">
                📍 {businessData.address}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          NAVEGACIÓN DE CATEGORÍAS
      ====================================================== */}

      {categoryData.length > 0 && (
        <div className="sticky top-0 z-30 border-b border-white/10 bg-[#070b12]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl overflow-x-auto px-5">
            <div className="flex min-w-max items-center gap-2 py-4">
              <a
                href="#productos"
                className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
                }}
              >
                Todos
              </a>

              {categoryData.map((category) => (
                <a
                  key={category.id}
                  href={`#categoria-${category.id}`}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CONTENIDO
      ====================================================== */}

      <div
        id="productos"
        className="mx-auto max-w-6xl px-5 py-12 sm:py-16"
      >
        {/* PRODUCTOS DESTACADOS */}

        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="mb-7">
              <span
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: primaryColor }}
              >
                Recomendados
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Productos destacados
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  primaryColor={primaryColor}
                  whatsapp={businessData.whatsapp}
                  businessName={businessData.name}
                />
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            TODAS LAS CATEGORÍAS
        ====================================================== */}

        {categoryData.length > 0 ? (
          <div className="space-y-16">
            {categoryData.map((category) => {
              const categoryProducts = availableProducts.filter(
                (product) => product.category_id === category.id
              );

              if (categoryProducts.length === 0) {
                return null;
              }

              return (
                <section
                  key={category.id}
                  id={`categoria-${category.id}`}
                  className="scroll-mt-24"
                >
                  <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-[0.25em]"
                        style={{ color: primaryColor }}
                      >
                        Categoría
                      </span>

                      <h2 className="mt-2 text-3xl font-black tracking-tight">
                        {category.name}
                      </h2>
                    </div>

                    <span className="hidden text-sm text-white/40 sm:block">
                      {categoryProducts.length}{" "}
                      {categoryProducts.length === 1
                        ? "producto"
                        : "productos"}
                    </span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        primaryColor={primaryColor}
                        whatsapp={businessData.whatsapp}
                        businessName={businessData.name}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* =====================================================
             SIN CATEGORÍAS
          ====================================================== */

          <section>
            <div className="mb-7">
              <span
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: primaryColor }}
              >
                Catálogo
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Nuestros productos
              </h2>
            </div>

            {availableProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {availableProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    primaryColor={primaryColor}
                    whatsapp={businessData.whatsapp}
                    businessName={businessData.name}
                  />
                ))}
              </div>
            ) : (
              <EmptyCatalog />
            )}
          </section>
        )}

        {/* =====================================================
            REDES SOCIALES
        ====================================================== */}

        {(businessData.instagram_url ||
          businessData.facebook_url ||
          businessData.tiktok_url) && (
          <section className="mt-20 border-t border-white/10 pt-10">
            <div className="text-center">
              <p className="text-sm text-white/40">
                Síguenos en nuestras redes
              </p>

              <div className="mt-5 flex justify-center gap-3">
                {businessData.instagram_url && (
                  <Link
                    href={businessData.instagram_url}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
                  >
                    Instagram
                  </Link>
                )}

                {businessData.facebook_url && (
                  <Link
                    href={businessData.facebook_url}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
                  >
                    Facebook
                  </Link>
                )}

                {businessData.tiktok_url && (
                  <Link
                    href={businessData.tiktok_url}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
                  >
                    TikTok
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-white/30">
          © {new Date().getFullYear()} {businessData.name}
        </div>
      </footer>
    </main>
  );
}
// ==========================================================
// TARJETA DE PRODUCTO
// ==========================================================

function ProductCard({
  product,
  primaryColor,
  whatsapp,
  businessName,
}: {
  product: Product;
  primaryColor: string;
  whatsapp: string | null;
  businessName: string;
}) {
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(product.price));

  const cleanWhatsapp = whatsapp
    ? whatsapp.replace(/\D/g, "")
    : "";

  const message = encodeURIComponent(
    `Hola ${businessName}, me interesa comprar: ${product.name} - $${formattedPrice}`
  );

  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${message}`
    : null;

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d] shadow-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
      {/* IMAGEN */}

      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* DESTACADO */}

        {product.is_featured && (
          <div
            className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg"
            style={{
              backgroundColor: primaryColor,
              color: "#07100a",
            }}
          >
            Destacado
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold leading-tight">
            {product.name}
          </h3>

          <span
            className="shrink-0 text-lg font-black"
            style={{ color: primaryColor }}
          >
            ${formattedPrice}
          </span>
        </div>

        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
            {product.description}
          </p>
        )}

        {/* ACCIONES */}

        <div className="mt-5 flex gap-2">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold transition hover:brightness-110"
              style={{
                backgroundColor: primaryColor,
                color: "#07100a",
              }}
            >
              Comprar
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 cursor-not-allowed rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-white/30"
            >
              Comprar
            </button>
          )}

          {/* CARRITO */}

          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-medium text-white transition hover:bg-white/10"
            aria-label={`Añadir ${product.name} al carrito`}
            title="Añadir al carrito"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

// ==========================================================
// CATÁLOGO VACÍO
// ==========================================================

function EmptyCatalog() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
        🛍️
      </div>

      <h3 className="mt-5 text-xl font-bold">
        El catálogo está vacío
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        Este negocio todavía no ha publicado productos.
      </p>
    </div>
  );
}