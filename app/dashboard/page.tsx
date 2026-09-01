const categories = [
  "Nuevos",
  "Destacados",
  "Productos",
  "Servicios",
];

const products = [
  {
    name: "Producto Premium",
    description: "Una descripción breve del producto.",
    price: "$49.90",
    category: "Destacados",
  },
  {
    name: "Producto Especial",
    description: "Calidad y estilo para tus clientes.",
    price: "$59.90",
    category: "Productos",
  },
  {
    name: "Producto Favorito",
    description: "Uno de los favoritos de nuestros clientes.",
    price: "$39.90",
    category: "Nuevos",
  },
];

export default function Home() {
  const whatsappNumber = "15555555555";

  const whatsappMessage = encodeURIComponent(
    "Hola, estoy interesado en uno de sus productos."
  );

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#" className="text-xl font-bold tracking-tight">
            TU<span className="text-lime-400">MARCA</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#inicio" className="transition hover:text-white">
              Inicio
            </a>
            <a href="#productos" className="transition hover:text-white">
              Productos
            </a>
            <a href="#nosotros" className="transition hover:text-white">
              Nosotros
            </a>
            <a href="#contacto" className="transition hover:text-white">
              Contacto
            </a>
          </nav>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="inicio"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(132,204,22,0.16),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-5 inline-flex rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm font-medium text-lime-300">
              Calidad que puedes sentir
            </span>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Tu negocio.
              <br />
              Tu estilo.
              <br />
              <span className="text-lime-400">Tu marca.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Presenta tus productos y servicios con una página profesional
              diseñada para que tus clientes conozcan y contacten tu negocio.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#productos"
                className="rounded-xl bg-lime-400 px-6 py-3.5 text-center font-semibold text-black transition hover:bg-lime-300"
              >
                Ver productos
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center font-semibold transition hover:bg-white/10"
              >
                Hablar por WhatsApp
              </a>
            </div>

            <div className="mt-10 flex gap-8 text-sm">
              <div>
                <strong className="block text-xl">100%</strong>
                <span className="text-white/50">Calidad</span>
              </div>

              <div>
                <strong className="block text-xl">24/7</strong>
                <span className="text-white/50">Atención</span>
              </div>

              <div>
                <strong className="block text-xl">★ 5.0</strong>
                <span className="text-white/50">Clientes</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-lime-400/20 via-zinc-900 to-black shadow-2xl">
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-lime-400/30 bg-lime-400/10 text-4xl">
                    ✦
                  </div>

                  <p className="text-sm uppercase tracking-[0.3em] text-lime-300">
                    Tu negocio
                  </p>

                  <h2 className="mt-3 text-4xl font-bold">
                    IMAGEN
                    <br />
                    PRINCIPAL
                  </h2>

                  <p className="mx-auto mt-5 max-w-xs text-sm text-white/40">
                    Aquí colocaremos posteriormente la fotografía principal
                    del negocio.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-zinc-900/90 p-4 shadow-xl backdrop-blur">
              <p className="text-xs text-white/40">Experiencia</p>
              <p className="mt-1 font-semibold">Profesional & única</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime-400">
              Explora
            </p>
            <h2 className="mt-2 text-3xl font-bold">Categorías</h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm transition ${
                index === 0
                  ? "border-lime-400 bg-lime-400 text-black"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="productos"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-lime-400">
                Nuestra selección
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Productos destacados
              </h2>
            </div>

            <a
              href="#productos"
              className="hidden text-sm text-white/50 transition hover:text-white sm:block"
            >
              Ver todos →
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition hover:-translate-y-1 hover:border-lime-400/30"
              >
                <div className="aspect-square bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                  <div className="flex h-full items-center justify-center text-sm text-white/20">
                    Imagen del producto
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-lime-400">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {product.price}
                    </span>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hola, estoy interesado en: ${product.name} - ${product.price}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="nosotros" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-video rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-800 to-black" />

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime-400">
              Sobre nosotros
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Una marca creada para hacer las cosas diferentes.
            </h2>

            <p className="mt-6 leading-8 text-white/55">
              Aquí podremos contar la historia del negocio, explicar qué lo
              hace especial y transmitir confianza a los visitantes.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hola, quiero conocer más sobre su negocio."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Conocer más
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contacto"
        className="border-y border-white/10 bg-lime-400 px-5 py-16 text-black"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest">
              ¿Tienes alguna pregunta?
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Hablemos por WhatsApp.
            </h2>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hola, quiero información sobre sus productos."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-black px-7 py-4 font-semibold text-white transition hover:bg-zinc-800"
          >
            Contactar ahora
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 TuMarca. Todos los derechos reservados.</p>

        <div className="flex gap-5">
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            Facebook
          </a>
          <a href="#" className="hover:text-white">
            TikTok
          </a>
        </div>
      </footer>
    </main>
  );
}