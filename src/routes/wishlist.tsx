import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Heart, Trash2 } from "lucide-react";
import dishChicken from "@/assets/dish-chicken.webp";
import dishMix from "@/assets/dish-mix.webp";
import dishMeat from "@/assets/dish-meat.webp";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "المفضلة - كباش" }] }),
  component: WishlistPage,
});

const ITEMS = [
  { name: "مندي دجاج", desc: "1/4 دجاج + أرز + صوص دقوس", price: 160, img: dishChicken },
  { name: "بيج بوكس دجاج", desc: "1/2 دجاج + أرز + صوص دقوس", price: 210, img: dishMix },
  { name: "مندي لحم", desc: "1/8 لحم + أرز + صوص دقوس", price: 160, img: dishMeat },
];

function WishlistPage() {
  return (
    <PageShell
      eyebrow="المفضلة"
      title="أطباقك المفضلة"
      description="احفظ أطباقك المفضلة وأعد طلبها بسهولة."
    >
      {ITEMS.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ITEMS.map((d) => (
            <article
              key={d.name}
              className="rounded-xl border border-border bg-surface-2/60 p-4 flex items-center gap-4"
            >
              <img
                src={d.img}
                alt={d.name}
                width={96}
                height={96}
                loading="lazy"
                className="h-24 w-24 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate">{d.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 truncate">{d.desc}</p>
                <div className="text-primary font-bold mt-2">{d.price} ج</div>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to="/cart"
                    className="text-xs font-bold rounded-md bg-primary text-primary-foreground px-3 py-1.5"
                  >
                    أضف للسلة
                  </Link>
                  <button
                    aria-label="حذف"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:text-primary"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function Empty() {
  return (
    <div className="text-center py-20">
      <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">قائمة المفضلة فارغة</h2>
      <p className="text-muted-foreground text-sm">ابدأ بإضافة أطباقك المفضلة.</p>
    </div>
  );
}
