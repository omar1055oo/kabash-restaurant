import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "سلة التسوق - كباش" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const delivery = items.length ? 25 : 0;
  const total = subtotal + delivery;

  if (!items.length) {
    return (
      <PageShell eyebrow="السلة" title="سلتك فارغة">
        <div className="text-center py-16">
          <ShoppingBag className="h-10 w-10 text-primary mx-auto mb-4" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            تصفح المنيو
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="السلة" title="سلة التسوق">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((i) => (
            <article
              key={i.cart_id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface-2/60 p-4"
            >
              <img
                loading="lazy"
                src={i.image_url}
                alt={i.product_name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate">{i.product_name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{i.size_name}</p>
                <div className="text-primary font-bold text-sm mt-1">{i.unit_price} ج</div>
              </div>
              <div className="flex items-center rounded-md border border-border">
                <button
                  aria-label="ناقص"
                  onClick={() => updateQuantity(i.cart_id, i.quantity - 1)}
                  className="h-8 w-8 inline-flex items-center justify-center hover:text-primary"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{i.quantity}</span>
                <button
                  aria-label="زيادة"
                  onClick={() => updateQuantity(i.cart_id, i.quantity + 1)}
                  className="h-8 w-8 inline-flex items-center justify-center hover:text-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                aria-label="حذف"
                onClick={() => removeItem(i.cart_id)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-border bg-surface-2/40 p-6 h-fit space-y-3">
          <h2 className="text-lg font-bold mb-2">ملخص الطلب</h2>
          <Row label="المجموع الفرعي" value={`${subtotal} ج`} />
          <Row label="رسوم التوصيل" value={`${delivery} ج`} />
          <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold">
            <span>الإجمالي</span>
            <span className="text-primary">{total} ج</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            إتمام الطلب
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
