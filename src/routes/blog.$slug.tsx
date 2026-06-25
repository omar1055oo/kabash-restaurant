import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Calendar, ArrowRight } from "lucide-react";
import heroMandi from "@/assets/hero-mandi.webp";
import dishMix from "@/assets/dish-mix.webp";
import dishMeat from "@/assets/dish-meat.webp";
import dishBox from "@/assets/dish-box.webp";

const POSTS: Record<string, { title: string; date: string; img: string; body: string[] }> = {
  "mandi-story": {
    title: "قصة المندي: من اليمن إلى موائد العالم",
    date: "18 يونيو 2026",
    img: heroMandi,
    body: [
      "يُعد المندي من أعرق أطباق المطبخ العربي، نشأ في اليمن ثم انتشر في دول الخليج ليصبح أحد أهم الأطباق التقليدية.",
      "تكمن سحرية المندي في طريقة الطهي البطيئة في حفرة عميقة تحت الأرض، مما يمنح اللحم نكهة مدخّنة فريدة.",
      "اليوم نقدم في كباش هذا الطبق بنفس الروح الأصيلة، مع لمسات مصرية تجعل التجربة أقرب لقلوب ضيوفنا.",
    ],
  },
  "rice-secrets": {
    title: "أسرار الأرز البسمتي المثالي",
    date: "10 يونيو 2026",
    img: dishMix,
    body: [
      "اختيار الأرز هو نصف الوصفة. نستخدم أجود أنواع البسمتي طويل الحبة لضمان نتيجة هشة ومتفصلة.",
      "نقع الأرز قبل الطهي لمدة 30 دقيقة يساعد على تخفيف النشا الزائد ومنع التكتل.",
      "البهارات تُضاف على دفعات لتمنح كل حبة أرز نكهة متوازنة.",
    ],
  },
  "lamb-cooking": {
    title: "كيف نطهو لحم المندي حتى الإذابة",
    date: "2 يونيو 2026",
    img: dishMeat,
    body: [
      "تقنية المدفون التقليدية تعتمد على الطهي البطيء بحرارة منخفضة لساعات طويلة.",
      "هذه الطريقة تحفظ عصارة اللحم وتمنحه طراوة استثنائية.",
      "نختار قطعًا مختارة من اللحم الطازج، ونتبلها بمزيج بهارات خاص قبل الطهي.",
    ],
  },
  "spices-guide": {
    title: "دليل البهارات الخليجية الأساسية",
    date: "25 مايو 2026",
    img: dishBox,
    body: [
      "البهارات هي روح المطبخ الخليجي؛ من الهيل واللومي إلى القرفة والقرنفل.",
      "كل بهار له دوره في بناء طبقات النكهة وتعميق الطعم.",
      "نحرص في كباش على طحن البهارات طازجة يوميًا لضمان أعلى جودة.",
    ],
  },
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} - كباش` },
          { name: "description", content: loaderData.body[0] },
        ]
      : [{ title: "مقال - كباش" }],
  }),
  notFoundComponent: () => (
    <PageShell title="المقال غير موجود">
      <Link to="/blog" className="text-primary hover:underline">
        العودة للمدونة
      </Link>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell title="حدث خطأ">
      <Link to="/blog" className="text-primary hover:underline">
        العودة للمدونة
      </Link>
    </PageShell>
  ),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const post = Route.useLoaderData();
  return (
    <PageShell>
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
        >
          <ArrowRight className="h-4 w-4" />
          كل المقالات
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5" />
          {post.date}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6">
          {post.title}
        </h1>
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-border">
          <img src={post.img} alt={post.title} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-5 text-base text-foreground/90 leading-loose">
          {post.body.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
