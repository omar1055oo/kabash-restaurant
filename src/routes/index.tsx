import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  ShoppingBag,
  ChevronLeft,
  Sprout,
  Menu,
  Utensils,
  Leaf,
  Truck,
  ShieldCheck,
  X,
  User,
} from "lucide-react";
import logo from "@/assets/logo.webp";
import heroMandi from "@/assets/hero-mandi.webp";
import dishChicken from "@/assets/dish-chicken.webp";
import dishMix from "@/assets/dish-mix.webp";
import dishMeat from "@/assets/dish-meat.webp";
import dishBox from "@/assets/dish-box.webp";
import { MenuService } from "@/services/api";
import { useCart } from "@/hooks/use-cart";

const indexQueryOptions = (queryClient: any) => queryOptions({
  queryKey: ["indexData"],
  queryFn: async () => {
    const products = await queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: () => MenuService.getAllProducts(),
    });
    const categories = await queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: () => MenuService.getCategories(),
    });
    return { products, categories };
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(indexQueryOptions(queryClient)),
  head: () => ({
    meta: [
      { title: "كباش - نكهة خليجية بروح مصرية" },
      { name: "description", content: "مطعم كباش - مندي، مدفون، مضغوط ودجاج ولحم بنكهات أصيلة" },
      { property: "og:title", content: "كباش - نكهة خليجية بروح مصرية" },
      {
        property: "og:description",
        content: "مطعم كباش - مندي، مدفون، مضغوط ودجاج ولحم بنكهات أصيلة",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;900&display=swap",
      },
      { rel: "preload", as: "image", href: heroMandi },
      { rel: "preload", as: "image", href: logo },
    ],
  }),
  component: Index,
});

type NavItem = { label: string; to?: string; href?: string; active?: boolean };
const NAV: NavItem[] = [
  { label: "الرئيسية", href: "/", active: true },
  { label: "من نحن", to: "/about" },
  { label: "المنيو", to: "/search" },
  { label: "الفروع", to: "/branches" },
  { label: "الطلبات الجماعية", to: "/catering" },
  { label: "تواصل معنا", to: "/contact" },
];

function Index() {
  const { products, categories } = Route.useLoaderData();
  const { items } = useCart();
  const [activeCatId, setActiveCatId] = useState(categories[0]?.id || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const displayedProducts = products.filter((p) => p.category_id === activeCatId).slice(0, 4);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen">
      {/* HERO with background */}
      <section className="relative overflow-hidden">
        <img
          src={heroMandi}
          alt=""
          width={1280}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover object-left"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/30 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        <div className="relative">
          {/* Nav */}
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-5">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
              <a href="/" className="flex items-center shrink-0">
                <img
                  src={logo}
                  alt="كباش"
                  width={64}
                  height={64}
                  className="h-14 w-14 sm:h-16 sm:w-16"
                />
              </a>

              <nav className="hidden lg:flex items-center justify-center gap-8 text-sm">
                {NAV.map((n) =>
                  n.to ? (
                    <Link
                      key={n.label}
                      to={n.to}
                      className={`relative py-1 transition-colors hover:text-primary ${
                        n.active ? "text-primary font-bold" : "text-foreground/90"
                      }`}
                    >
                      {n.label}
                      {n.active && (
                        <span className="absolute -bottom-1 right-0 left-0 mx-auto h-0.5 w-6 bg-primary rounded-full" />
                      )}
                    </Link>
                  ) : (
                    <a
                      key={n.label}
                      href={n.href}
                      className={`relative py-1 transition-colors hover:text-primary ${
                        n.active ? "text-primary font-bold" : "text-foreground/90"
                      }`}
                    >
                      {n.label}
                      {n.active && (
                        <span className="absolute -bottom-1 right-0 left-0 mx-auto h-0.5 w-6 bg-primary rounded-full" />
                      )}
                    </a>
                  ),
                )}
              </nav>

              <div className="flex items-center gap-3 justify-end">
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors relative"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    السلة
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground shadow-sm">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-2 hover:bg-surface transition-colors text-sm font-bold"
                  >
                    <User className="h-4 w-4" />
                    دخول
                  </Link>
                </div>
                <div className="flex items-center gap-2 sm:hidden">
                  <Link
                    to="/cart"
                    className="flex items-center justify-center h-10 w-10 rounded-md border border-border/30 hover:bg-foreground/5 transition-colors relative"
                  >
                    <ShoppingBag className="h-5 w-5 opacity-80" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground shadow-sm">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    aria-label="القائمة"
                    className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/30 hover:bg-foreground/5 transition-colors"
                    onClick={() => setMobileOpen((v) => !v)}
                  >
                    <span className="sr-only">القائمة</span>
                    <Menu className="h-5 w-5 opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero content */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 pb-24 sm:pb-32 lg:pb-40">
            <div className="max-w-xl">
              <Sprout className="h-6 w-6 text-primary mb-4" aria-hidden />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight">
                نكهة خليجية
                <br />
                <span className="text-primary">بروح مصرية</span>
              </h1>
              <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-md">
                مندي، مدفون، مضغوط ودجاج ولحم بنكهات أصيلة
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#order"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  اطلب الآن
                </a>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/60 px-6 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  استعرض المنيو
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order section */}
      <section id="order" className="relative -mt-16 sm:-mt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-2xl border border-border bg-surface backdrop-blur-md p-5 sm:p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <Sprout className="h-5 w-5 text-primary mb-2" aria-hidden />
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-border" />
                <h2 className="text-xl sm:text-2xl font-bold">اطلب الآن</h2>
                <span className="h-px w-10 bg-border" />
              </div>
            </div>

            {/* Categories */}
            <div
              role="tablist"
              aria-label="أقسام المنيو"
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 mb-6 justify-start lg:justify-center scrollbar-thin"
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={activeCatId === c.id}
                  onClick={() => setActiveCatId(c.id)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
                    activeCatId === c.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Dishes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedProducts.map((d, i) => (
                <Link
                  to={`/product/${d.id}`}
                  key={i}
                  className="group rounded-xl border border-border bg-surface-2/60 p-3 flex items-center gap-3 hover:border-primary/40 transition-colors min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-primary font-bold text-sm mb-1">
                      {d.sizes?.[0]?.price || 0} ج
                    </div>
                    <h3 className="text-base font-bold truncate">{d.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{d.description}</p>
                  </div>
                  <img
                    src={d.image_url}
                    alt={d.name}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover shrink-0"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/60 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                عرض المنيو كامل
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between p-5 px-4 sm:px-6">
            <a href="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
              <img src={logo} alt="كباش" width={64} height={64} className="h-14 w-14" />
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/30 hover:bg-foreground/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5 opacity-80" />
              <span className="sr-only">إغلاق القائمة</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            <nav className="flex flex-col gap-2 text-center">
              {NAV.map((n) =>
                n.to ? (
                  <Link
                    key={n.label}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-xl sm:text-2xl py-4 rounded-xl transition-colors ${n.active ? "bg-primary/5 text-primary font-bold" : "text-foreground/90 font-semibold hover:bg-surface"}`}
                  >
                    {n.label}
                  </Link>
                ) : (
                  <a
                    key={n.label}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-xl sm:text-2xl py-4 rounded-xl transition-colors ${n.active ? "bg-primary/5 text-primary font-bold" : "text-foreground/90 font-semibold hover:bg-surface"}`}
                  >
                    {n.label}
                  </a>
                ),
              )}
            </nav>

            <div className="mt-auto pt-8 flex flex-col gap-4 border-t border-border/20">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2/60 px-6 py-4 text-base font-bold text-foreground hover:bg-surface transition-colors"
              >
                <User className="h-5 w-5" />
                حسابي
              </Link>
              <a
                href="#order"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                اطلب الآن
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
