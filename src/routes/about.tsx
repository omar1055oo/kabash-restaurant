import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Sprout, Award, Users, Utensils } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن - كباش" },
      {
        name: "description",
        content: "تعرف على قصة كباش، رحلتنا في تقديم نكهة خليجية بروح مصرية.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Sprout, title: "مكونات طازجة", desc: "نختار مكوناتنا يوميًا لضمان أعلى جودة." },
  { icon: Utensils, title: "وصفات أصيلة", desc: "نتبع وصفات تقليدية بنكهات خليجية صافية." },
  { icon: Award, title: "جودة معتمدة", desc: "نلتزم بأعلى معايير السلامة والجودة الغذائية." },
  { icon: Users, title: "فريق شغوف", desc: "طهاة وفريق خدمة متخصصون في إسعاد ضيوفنا." },
];

function AboutPage() {
  return (
    <PageShell
      eyebrow="من نحن"
      title="نكهة خليجية بروح مصرية"
      description="بدأت رحلة كباش من شغفنا بالمطبخ الخليجي الأصيل، وقررنا أن نقدمه بلمسة مصرية محببة لقلوب ضيوفنا في كل مكان."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">قصتنا</h2>
          <p className="text-muted-foreground mb-4">
            انطلق كباش بفكرة بسيطة: أن نقدم المندي والمدفون والمضغوط بنفس النكهة الأصيلة التي يعرفها
            عشاق المطبخ الخليجي، مع لمسة مصرية تجعل التجربة فريدة.
          </p>
          <p className="text-muted-foreground">
            اليوم، نقدم تجربة طعام كاملة من فروعنا المنتشرة، عبر التوصيل، وعبر خدمة الطلبات الجماعية
            للمناسبات.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-surface-2/60 p-5">
              <v.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="text-base font-bold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
