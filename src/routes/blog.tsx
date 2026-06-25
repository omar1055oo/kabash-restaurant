import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import heroMandi from "@/assets/hero-mandi.webp";
import dishMix from "@/assets/dish-mix.webp";
import dishMeat from "@/assets/dish-meat.webp";
import dishBox from "@/assets/dish-box.webp";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "المدونة - كباش" },
      { name: "description", content: "مقالات وأخبار عن المطبخ الخليجي ووصفات كباش." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  {
    slug: "mandi-story",
    title: "قصة المندي: من اليمن إلى موائد العالم",
    excerpt: "تعرف على أصل المندي وكيف انتشر في منطقة الخليج وأصبح طبقًا محبوبًا.",
    date: "18 يونيو 2026",
    img: heroMandi,
  },
  {
    slug: "rice-secrets",
    title: "أسرار الأرز البسمتي المثالي",
    excerpt: "نصائح من شيف كباش للحصول على أرز هش ومذاق متكامل في كل مرة.",
    date: "10 يونيو 2026",
    img: dishMix,
  },
  {
    slug: "lamb-cooking",
    title: "كيف نطهو لحم المندي حتى الإذابة",
    excerpt: "تقنية المدفون التقليدية ولماذا تمنح اللحم نكهة لا تُقارن.",
    date: "2 يونيو 2026",
    img: dishMeat,
  },
  {
    slug: "spices-guide",
    title: "دليل البهارات الخليجية الأساسية",
    excerpt: "أهم البهارات التي لا غنى عنها في أي مطبخ خليجي أصيل.",
    date: "25 مايو 2026",
    img: dishBox,
  },
];

function BlogPage() {
  return (
    <PageShell
      eyebrow="المدونة"
      title="قصص ووصفات من كباش"
      description="من المطبخ إلى مدونتنا، نشاركك أسرار النكهة الأصيلة."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group rounded-2xl border border-border bg-surface-2/60 overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground mb-2">{p.date}</div>
              <h2 className="text-lg font-bold mb-2 leading-snug">{p.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
