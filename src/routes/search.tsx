import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { Search } from "lucide-react";
import { MenuService } from "@/services/api";

const searchQueryOptions = (queryClient: any) => queryOptions({
  queryKey: ["searchData"],
  queryFn: async () => {
    const categories = await queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: () => MenuService.getCategories(),
    });
    const products = await queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: () => MenuService.getAllProducts(),
    });

    // Group products by category to match the UI shape
    const menuData = categories
      .map((cat: any) => ({
        name: cat.name,
        items: products.filter((p: any) => p.category_id === cat.id),
      }))
      .filter((cat: any) => cat.items.length > 0);

    return { menuData };
  },
});

export const Route = createFileRoute("/search")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(searchQueryOptions(queryClient)),
  head: () => ({
    meta: [{ title: "المنيو - كباش" }, { name: "description", content: "تصفح منيو كباش الأصيل." }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { menuData } = Route.useLoaderData();
  const [q, setQ] = useState("");

  // Filter categories based on search query
  const filteredCategories = menuData
    .map((category) => ({
      ...category,
      items: category.items.filter((i) => i.name.includes(q) || i.description.includes(q)),
    }))
    .filter((category) => category.items.length > 0);

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <PageShell eyebrow="المنيو" title="تصفح قائمة الطعام">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن طبقك المفضل..."
            className="w-full rounded-2xl bg-surface-2/60 border border-border pr-12 pl-4 py-4 text-base outline-none focus:border-primary focus:bg-surface-2 transition-all shadow-sm"
          />
        </div>
        {q && (
          <div className="text-sm font-bold text-muted-foreground mt-3 px-2">
            {totalResults} نتيجة
          </div>
        )}
      </div>

      <div className="space-y-12">
        {filteredCategories.map((cat) => (
          <section key={cat.name}>
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
              {cat.name}
              <span className="h-px flex-1 bg-border block" />
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.items.map((d) => (
                <Link
                  to={`/product/${d.id}`}
                  key={d.name}
                  className="rounded-xl border border-border bg-surface-2/60 p-3 flex items-center gap-3 hover:border-primary/40 transition-colors min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-primary font-bold text-sm mb-1">
                      {d.sizes?.[0]?.price || 0} ج
                    </div>
                    <h3 className="text-base font-bold truncate">{d.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {d.description}
                    </p>
                  </div>
                  <img
                    src={d.image_url}
                    alt={d.name}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-20 w-20 rounded-full object-cover shrink-0"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-surface-2/20 rounded-3xl border border-dashed border-border/50">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">لا توجد نتائج</h3>
            <p className="text-sm mt-2 opacity-80">
              عذراً، لم نتمكن من العثور على أطباق تطابق بحثك.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
