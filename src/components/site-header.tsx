import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import logo from "@/assets/logo.webp";
import { useCart } from "@/hooks/use-cart";
import { CustomerService } from "@/services/api";

type NavItem = { label: string; to?: string; href?: string };
const NAV: NavItem[] = [
  { label: "الرئيسية", to: "/" },
  { label: "من نحن", to: "/about" },
  { label: "المنيو", to: "/search" },
  { label: "الفروع", to: "/branches" },
  { label: "الطلبات الجماعية", to: "/catering" },
  { label: "تواصل معنا", to: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    CustomerService.getProfile().then((profile) => {
      if (profile?.full_name) {
        setProfileName(profile.full_name.split(" ")[0]);
      }
    });
  }, []);
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center shrink-0">
              <img src={logo} alt="كباش" width={64} height={64} className="h-14 w-14" />
            </Link>

            <nav className="hidden lg:flex items-center justify-center gap-8 text-sm">
              {NAV.map((n) =>
                n.href ? (
                  <a
                    key={n.label}
                    href={n.href}
                    className="relative py-1 transition-colors hover:text-primary text-foreground/90"
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    key={n.label}
                    to={n.to!}
                    className="relative py-1 transition-colors hover:text-primary [&.active]:text-primary [&.active]:font-bold text-foreground/90"
                    activeProps={{ className: "active" }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {isActive && (
                          <span className="absolute -bottom-1 right-0 left-0 mx-auto h-0.5 w-6 bg-primary rounded-full" />
                        )}
                      </>
                    )}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
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
                {profileName || "حسابي"}
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/30 hover:bg-foreground/5 transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <span className="sr-only">القائمة</span>
                <Menu className="h-5 w-5 opacity-80" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between p-5 px-4 sm:px-6">
            <Link
              to="/"
              className="flex items-center shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <img src={logo} alt="كباش" width={64} height={64} className="h-14 w-14" />
            </Link>
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
                n.href ? (
                  <a
                    key={n.label}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-xl sm:text-2xl py-4 rounded-xl transition-colors text-foreground/90 font-semibold hover:bg-surface"
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    key={n.label}
                    to={n.to!}
                    onClick={() => setMobileOpen(false)}
                    className="text-xl sm:text-2xl py-4 rounded-xl transition-colors text-foreground/90 font-semibold hover:bg-surface [&.active]:bg-primary/5 [&.active]:text-primary [&.active]:font-bold"
                    activeProps={{ className: "active" }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
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
                {profileName || "حسابي"}
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                اطلب الآن
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
