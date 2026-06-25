import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminService } from "@/services/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types";

export const Route = createFileRoute("/admin/categories")({
  loader: async () => {
    const res = await AdminService.getCategories();
    return { categories: res.data as Category[] };
  },
  component: AdminCategories,
});

function AdminCategories() {
  const { categories } = Route.useLoaderData();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm(cat);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!editForm.name) {
      toast.error("اسم القسم مطلوب");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isAdding) {
        await AdminService.createCategory({
          name: editForm.name,
          sort_order: editForm.sort_order || categories.length,
        });
        toast.success("تم إضافة القسم بنجاح");
      } else if (editingId) {
        await AdminService.updateCategory(editingId, {
          name: editForm.name,
          sort_order: editForm.sort_order,
        });
        toast.success("تم التعديل بنجاح");
      }
      cancelEdit();
      router.invalidate();
    } catch (e) {
      toast.error("حدث خطأ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ قد يؤدي هذا لحذف المنتجات المرتبطة به.")) return;
    try {
      await AdminService.deleteCategory(id);
      toast.success("تم الحذف بنجاح");
      router.invalidate();
    } catch (e) {
      toast.error("لا يمكن الحذف (قد يكون هناك منتجات مرتبطة)");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">إدارة الأقسام</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({ sort_order: categories.length });
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            إضافة قسم
          </button>
        )}
      </div>

      <div className="bg-surface-2/40 border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_100px] gap-4 p-4 border-b border-border bg-surface text-sm font-bold text-muted-foreground">
          <div>الاسم</div>
          <div className="text-center">الترتيب</div>
          <div className="text-center">الإجراءات</div>
        </div>

        {isAdding && (
          <div className="grid grid-cols-[1fr_80px_100px] gap-4 p-4 border-b border-border items-center bg-primary/5">
            <input
              type="text"
              placeholder="اسم القسم"
              className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              type="number"
              className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-center outline-none focus:border-primary"
              value={editForm.sort_order || 0}
              onChange={(e) =>
                setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })
              }
            />
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={isSubmitting}
                onClick={handleSave}
                className="text-green-500 hover:text-green-600 p-2"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                disabled={isSubmitting}
                onClick={cancelEdit}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {categories.map((cat) =>
          editingId === cat.id ? (
            <div
              key={cat.id}
              className="grid grid-cols-[1fr_80px_100px] gap-4 p-4 border-b border-border items-center bg-primary/5"
            >
              <input
                type="text"
                className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                type="number"
                className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-center outline-none focus:border-primary"
                value={editForm.sort_order || 0}
                onChange={(e) =>
                  setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })
                }
              />
              <div className="flex items-center justify-center gap-2">
                <button
                  disabled={isSubmitting}
                  onClick={handleSave}
                  className="text-green-500 hover:text-green-600 p-2"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={cancelEdit}
                  className="text-muted-foreground hover:text-foreground p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={cat.id}
              className="grid grid-cols-[1fr_80px_100px] gap-4 p-4 border-b border-border last:border-0 items-center hover:bg-surface-2/80 transition-colors"
            >
              <div className="font-bold">{cat.name}</div>
              <div className="text-center text-sm font-mono text-muted-foreground">
                {cat.sort_order}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-500 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ),
        )}
        {categories.length === 0 && !isAdding && (
          <div className="p-8 text-center text-muted-foreground">لا توجد أقسام حالياً.</div>
        )}
      </div>
    </div>
  );
}
