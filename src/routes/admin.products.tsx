import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminService, MenuService } from "@/services/api";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ArrowRight,
  Image as ImageIcon,
  Package,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Product, Category, ProductSize } from "@/types";

export const Route = createFileRoute("/admin/products")({
  loader: async () => {
    const [catsRes, prodsRes] = await Promise.all([
      AdminService.getCategories(),
      AdminService.getProducts(),
    ]);
    return {
      categories: (catsRes.data as Category[]) || [],
      products: (prodsRes.data as Product[]) || [],
    };
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { categories, products } = Route.useLoaderData();
  const router = useRouter();

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://omar280sa-we.hf.space/upload-product-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      if (data.status === "success" && data.image_url) {
        setEditingProduct((prev) => prev ? { ...prev, image_url: data.image_url } : null);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Filter sizes visually before submitting
  const [localSizes, setLocalSizes] = useState<Partial<ProductSize>[]>([]);

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setLocalSizes(prod.sizes || []);
  };

  const handleAddNew = () => {
    setEditingProduct({
      name: "",
      description: "",
      image_url: "",
      category_id: categories[0]?.id || "",
      is_available: true,
    });
    setLocalSizes([]);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setLocalSizes([]);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.category_id) {
      toast.error("اسم المنتج والقسم مطلوبان");
      return;
    }

    setIsSubmitting(true);
    try {
      let productId = editingProduct.id;

      const payload = {
        name: editingProduct.name,
        description: editingProduct.description || "",
        image_url: editingProduct.image_url || "",
        category_id: editingProduct.category_id,
        is_available: editingProduct.is_available ?? true,
      };

      if (productId) {
        // Update product
        await AdminService.updateProduct(productId, payload);
      } else {
        // Create product
        const { data } = await AdminService.createProduct(payload);
        if (!data) throw new Error("Creation failed");
        productId = data.id;
      }

      // Handle sizes
      // 1. Delete removed sizes (if editing)
      if (editingProduct.id) {
        const originalSizes = products.find((p) => p.id === editingProduct.id)?.sizes || [];
        const currentSizeIds = localSizes.map((s) => s.id).filter(Boolean);
        const removedSizes = originalSizes.filter((s) => !currentSizeIds.includes(s.id));
        for (const rs of removedSizes) {
          await AdminService.deleteProductSize(rs.id);
        }
      }

      // 2. Upsert sizes
      for (const size of localSizes) {
        if (!size.name || size.price === undefined) continue;
        if (size.id) {
          await AdminService.updateProductSize(size.id, { name: size.name, price: size.price });
        } else {
          await AdminService.createProductSize({
            product_id: productId,
            name: size.name,
            price: size.price,
          });
        }
      }

      toast.success(editingProduct.id ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
      cancelEdit();
      router.invalidate();
    } catch (e) {
      console.error(e);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    try {
      await AdminService.deleteProduct(id);
      toast.success("تم حذف المنتج بنجاح");
      router.invalidate();
    } catch (e) {
      toast.error("لا يمكن حذف المنتج");
    }
  };

  if (editingProduct) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <button
            onClick={cancelEdit}
            className="p-2 hover:bg-surface-2 rounded-lg text-muted-foreground transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-black">
            {editingProduct.id ? "تعديل منتج" : "إضافة منتج جديد"}
          </h2>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4 bg-surface-2/40 border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">البيانات الأساسية</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">اسم المنتج *</label>
                <input
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">القسم *</label>
                <select
                  value={editingProduct.category_id || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category_id: e.target.value })
                  }
                  className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    اختر القسم
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">الوصف</label>
              <textarea
                rows={2}
                value={editingProduct.description || ""}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">رابط الصورة (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingProduct.image_url || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image_url: e.target.value })
                    }
                    className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    dir="ltr"
                  />
                  <label className="flex items-center justify-center cursor-pointer bg-surface-2 hover:bg-surface border border-border px-3 rounded-lg transition-colors min-w-[80px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    {isUploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        <Upload className="h-4 w-4" /> رفع
                      </span>
                    )}
                  </label>
                </div>
              </div>
              {editingProduct.image_url && (
                <img
                  src={editingProduct.image_url}
                  alt="preview"
                  className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
                />
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={editingProduct.is_available ?? true}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, is_available: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-semibold">متاح للطلب (مرئي للعملاء)</span>
            </label>
          </div>

          <div className="space-y-4 bg-surface-2/40 border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">أحجام وأسعار المنتج</h3>
              <button
                onClick={() => setLocalSizes([...localSizes, { name: "", price: 0 }])}
                className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4" /> إضافة حجم
              </button>
            </div>

            {localSizes.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border rounded-xl">
                لم يتم إضافة أي أحجام. اضف حجم (مثل: وجبة عادية) لتحديد السعر.
              </div>
            )}

            <div className="space-y-3">
              {localSizes.map((size, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="اسم الحجم (مثال: دجاجة كاملة)"
                    value={size.name || ""}
                    onChange={(e) => {
                      const newSizes = [...localSizes];
                      newSizes[idx].name = e.target.value;
                      setLocalSizes(newSizes);
                    }}
                    className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="relative w-32">
                    <input
                      type="number"
                      placeholder="السعر"
                      value={size.price || ""}
                      onChange={(e) => {
                        const newSizes = [...localSizes];
                        newSizes[idx].price = parseFloat(e.target.value) || 0;
                        setLocalSizes(newSizes);
                      }}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 pr-8 text-sm outline-none focus:border-primary"
                      dir="ltr"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ج
                    </span>
                  </div>
                  <button
                    onClick={() => setLocalSizes(localSizes.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              disabled={isSubmitting}
              onClick={cancelEdit}
              className="px-6 py-2.5 rounded-lg font-bold text-muted-foreground hover:bg-surface-2 transition-colors"
            >
              إلغاء
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleSaveProduct}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <h2 className="text-2xl font-black">إدارة المنتجات</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة منتج
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((prod) => (
          <div
            key={prod.id}
            className={`rounded-2xl border border-border bg-surface-2/40 p-4 flex gap-4 transition-colors hover:border-primary/40 ${!prod.is_available ? "opacity-60 grayscale" : ""}`}
          >
            {prod.image_url ? (
              <img
                src={prod.image_url}
                alt={prod.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-surface flex items-center justify-center shrink-0 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-20" />
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold truncate" title={prod.name}>
                  {prod.name}
                </h3>
                <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground truncate mb-1">
                {categories.find((c) => c.id === prod.category_id)?.name || "غير محدد"}
              </div>

              <div className="mt-auto flex flex-wrap gap-1">
                {prod.sizes?.map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] font-bold bg-background border border-border px-1.5 py-0.5 rounded text-primary"
                  >
                    {s.name} - {s.price} ج
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-surface-2/20">
            <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>لا توجد منتجات مضافة بعد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
