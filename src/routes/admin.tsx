import { createFileRoute, Outlet, Link, redirect, useRouter, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Tag, Package, LogOut, ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo.webp";
import { AuthService } from "@/services/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return;
    }
    // Only check auth on the client side since we don't have cookies setup for SSR Supabase Auth
    if (typeof document !== "undefined") {
      const role = await AuthService.getUserRole();
      if (role !== "admin") {
        throw redirect({ to: "/admin/login" });
      }
    }
  },
  head: () => ({ meta: [{ title: "لوحة الإدارة - كباش" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        const role = await AuthService.getUserRole();
        if (isMounted) {
          if (role !== "admin") {
            router.navigate({ to: "/admin/login", replace: true });
          } else {
            setIsCheckingAuth(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          router.navigate({ to: "/admin/login", replace: true });
        }
      }
    };
    verify();
    
    return () => { isMounted = false; };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <Outlet />;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    await AuthService.signOut();
    router.navigate({ to: "/admin/login" });
  };

  const NAV = [
    { label: "لوحة التحكم", to: "/admin", icon: LayoutDashboard, exact: true },
    { label: "الأقسام", to: "/admin/categories", icon: Tag },
    { label: "المنتجات", to: "/admin/products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-l border-border bg-surface-2/60 fixed top-0 bottom-0 right-0 z-40">
        <div className="p-6 border-b border-border flex items-center gap-4">
          <img src={logo} alt="كباش" className="w-10 h-10" />
          <h1 className="font-black text-xl text-primary">إدارة المنيو</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground/80 hover:bg-surface hover:text-primary [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-bold"
              activeProps={{ className: "active" }}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground/80 hover:bg-surface hover:text-primary"
          >
            <ArrowRight className="h-5 w-5" />
            العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground/80 hover:bg-surface hover:text-red-500 font-bold"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden sticky top-0 z-40 bg-surface-2/90 backdrop-blur border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="كباش" className="w-8 h-8" />
          <h1 className="font-black text-lg text-primary">الإدارة</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center overflow-x-auto gap-2 p-4 border-b border-border bg-background">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.exact }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm border border-border bg-surface-2/40 transition-colors [&.active]:border-primary [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-bold"
            activeProps={{ className: "active" }}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-8 md:mr-64">
        <Outlet />
      </main>
    </div>
  );
}
