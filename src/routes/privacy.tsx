import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية - كباش" },
      { name: "description", content: "كيف نتعامل مع بياناتك الشخصية في كباش." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "البيانات التي نجمعها",
    p: "نجمع البيانات الضرورية لتنفيذ طلبك مثل الاسم ورقم الهاتف والعنوان.",
  },
  {
    h: "استخدام البيانات",
    p: "تُستخدم بياناتك حصريًا لمعالجة الطلبات وتحسين تجربتك، ولن تُشارك مع أي طرف ثالث لأغراض تسويقية.",
  },
  { h: "ملفات الارتباط", p: "نستخدم ملفات الارتباط لتحسين أداء الموقع وتذكر تفضيلاتك." },
  { h: "حماية البيانات", p: "نستخدم تقنيات تشفير حديثة لحماية بياناتك من الوصول غير المصرح به." },
  { h: "حقوقك", p: "يحق لك في أي وقت طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالتواصل معنا." },
  { h: "التواصل", p: "لأي استفسار يخص الخصوصية، تواصل معنا عبر hello@kabash.eg" },
];

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="قانوني"
      title="سياسة الخصوصية"
      description="نحرص على حماية بياناتك واحترام خصوصيتك."
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-bold mb-3">{s.h}</h2>
            <p className="text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
