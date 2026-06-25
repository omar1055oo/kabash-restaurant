import { createFileRoute, Link } from "@tanstack/react-router";
import { Tag, Package } from "lucide-react";
import { AdminService } from "@/services/api";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const [cats, prods] = await Promise.all([
      AdminService.getCategories(),
      AdminService.getProducts(),
    ]);
    return { catsCount: cats.data?.length || 0, prodsCount: prods.data?.length || 0 };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { catsCount, prodsCount } = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black mb-2">مرحباً بك في لوحة الإدارة</h2>
        <p className="text-muted-foreground">
          من هنا يمكنك إدارة المنيو والمنتجات الخاصة بمطعم كباش.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          to="/admin/categories"
          className="block rounded-2xl border border-border bg-surface-2/40 p-6 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">الأقسام</h3>
              <p className="text-sm text-muted-foreground">إدارة وتصنيف المنيو</p>
            </div>
          </div>
          <div className="text-3xl font-black text-primary">{catsCount}</div>
        </Link>

        <Link
          to="/admin/products"
          className="block rounded-2xl border border-border bg-surface-2/40 p-6 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">المنتجات</h3>
              <p className="text-sm text-muted-foreground">إدارة الأطباق والأحجام</p>
            </div>
          </div>
          <div className="text-3xl font-black text-primary">{prodsCount}</div>
        </Link>
      </div>
    </div>
  );
}
