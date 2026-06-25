import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthService } from "@/services/api";
import { toast } from "sonner";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.webp";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "تسجيل الدخول - الإدارة" }] }),
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await AuthService.signIn(email, password);
      if (error) throw error;

      if (data.session) {
        const role = await AuthService.getUserRole();
        if (role === "admin") {
          toast.success("تم تسجيل الدخول بنجاح");
          router.navigate({ to: "/admin" });
        } else {
          await AuthService.signOut();
          toast.error("عذراً، ليس لديك صلاحية الدخول كمسؤول");
        }
      }
    } catch (e: Error | unknown) {
      const err = e as Error;
      toast.error(err.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative"
      dir="rtl"
      lang="ar"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="كباش" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-primary">إدارة مطعم كباش</h1>
          <p className="text-muted-foreground mt-2">تسجيل الدخول للوحة التحكم</p>
        </div>

        <div className="bg-surface-2/40 border border-border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl bg-background border border-border pr-12 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="admin@kabbash.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl bg-background border border-border pr-12 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-70 mt-6"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
