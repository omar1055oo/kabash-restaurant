import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { MenuService } from "@/services/api";
import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

const productQueryOptions = (id: string) => queryOptions({
  queryKey: ["product", id],
  queryFn: () => MenuService.getProductById(id),
});

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params, context: { queryClient } }) => {
    const product = await queryClient.ensureQueryData(productQueryOptions(params.id));
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.product?.name || "المنتج"} - كباش` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);

  const sizes = product.sizes?.length
    ? product.sizes
    : [{ id: "default", name: "افتراضي", price: 0 }];
  const currentSize = sizes[selectedSize] || sizes[0];
  const currentPrice = currentSize.price || 0;
  const total = currentPrice * qty;

  return (
    <PageShell eyebrow="المنتجات" title={product.name}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden border border-border bg-surface-2/40">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {/* Sizes */}
            {product.sizes && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">اختر الحجم</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSize(idx)}
                      className={`flex flex-col gap-1 items-start p-4 rounded-xl border text-right transition-colors ${
                        selectedSize === idx
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface-2/40 hover:border-primary/40"
                      }`}
                    >
                      <span className="font-bold">{s.name}</span>
                      <span className="text-sm text-primary font-bold">{s.price} ج</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-border bg-surface-2/40 overflow-hidden h-14">
                <button
                  aria-label="ناقص"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-full px-5 inline-flex items-center justify-center hover:bg-surface hover:text-primary transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-12 text-center text-lg font-bold">{qty}</span>
                <button
                  aria-label="زيادة"
                  onClick={() => setQty(qty + 1)}
                  className="h-full px-5 inline-flex items-center justify-center hover:bg-surface hover:text-primary transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Total */}
              <div className="text-2xl font-black text-primary">{total} ج</div>
            </div>

            <button
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              onClick={() => {
                addItem({
                  product_id: product.id,
                  product_name: product.name,
                  size_id: currentSize.id,
                  size_name: currentSize.name,
                  quantity: qty,
                  unit_price: currentPrice,
                  image_url: product.image_url,
                });
                toast.success("تمت الإضافة للسلة", {
                  description: `تم إضافة ${qty} x ${product.name} (${currentSize.name}) بنجاح.`,
                });
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              أضف إلى السلة
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
