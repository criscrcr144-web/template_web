"use client";

import {
  BarChart3,
  Box,
  FolderOpen,
  MessageCircle,
  Palette,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";

const sections = [
  {
    title: "Productos",
    description: "Agrega, edita y elimina productos.",
    icon: Box,
    href: "/dashboard/products",
  },
  {
    title: "Categorías",
    description: "Organiza tus productos por categorías.",
    icon: FolderOpen,
    href: "/dashboard/categories",
  },
  {
    title: "Pedidos",
    description: "Consulta los pedidos realizados.",
    icon: ShoppingBag,
    href: "/dashboard/pedidos",
  },
  {
    title: "Diseño",
    description: "Personaliza colores, logo e imágenes.",
    icon: Palette,
    href: "/dashboard/diseno",
  },
  {
    title: "Mi negocio",
    description: "Edita la información de tu negocio.",
    icon: Store,
    href: "/dashboard/negocio",
  },
  {
    title: "WhatsApp",
    description: "Configura el número para recibir pedidos.",
    icon: MessageCircle,
    href: "/dashboard/whatsapp",
  },
  {
    title: "Estadísticas",
    description: "Consulta el rendimiento de tu página.",
    icon: BarChart3,
    href: "/dashboard/estadisticas",
  },
  {
    title: "Configuración",
    description: "Administra la configuración de tu cuenta.",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* Encabezado */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-lime-400">
            PANEL DE ADMINISTRACIÓN
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Bienvenido a tu Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Administra todos los aspectos de tu página web desde un solo lugar.
          </p>
        </div>

        {/* Estado de la página */}
        <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Estado de tu página
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]" />

                <span className="text-lg font-semibold">
                  Página activa
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                Tu página está disponible para tus clientes.
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium transition hover:border-lime-400 hover:text-lime-400"
            >
              Ver mi página
            </a>

          </div>
        </div>

        {/* Secciones */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Administración
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Todo lo que puedes modificar de tu página.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition duration-200 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-lime-400 transition group-hover:bg-lime-400 group-hover:text-black">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-semibold">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {section.description}
                  </p>

                  <div className="mt-5 text-xs font-medium text-zinc-600 transition group-hover:text-lime-400">
                    Administrar →
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}