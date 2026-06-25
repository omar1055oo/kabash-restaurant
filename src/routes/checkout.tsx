import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "إتمام الطلب - كباش" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [profile, setProfile] = useState({
    fullName: "",
    primaryPhone: "",
    mainAddress: "",
    secondaryAddress: "",
    secondaryPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const delivery = items.length ? 25 : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    const saved = localStorage.getItem("customerProfile");
    if (!saved) {
      toast.info("يرجى إنشاء حسابك أو إكمال بياناتك أولاً لإتمام الطلب");
      navigate({ to: "/profile" });
      return;
    }
    try {
      const data = JSON.parse(saved);
      if (!data.fullName || !data.mainAddress || !data.primaryPhone) {
        toast.info("يرجى إكمال بيانات حسابك أولاً لإتمام الطلب");
        navigate({ to: "/profile" });
      } else {
        setProfile({
          fullName: data.fullName,
          primaryPhone: data.primaryPhone,
          mainAddress: data.mainAddress,
          secondaryAddress: data.secondaryAddress || "",
          secondaryPhone: data.secondaryPhone || "",
        });
      }
    } catch (e) {
      navigate({ to: "/profile" });
    }
  }, [navigate]);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    setIsSubmitting(true);

    const city = (document.getElementById("city") as HTMLInputElement)?.value || "";
    const area = (document.getElementById("area") as HTMLInputElement)?.value || "";
    const notes = (document.getElementById("notes") as HTMLTextAreaElement)?.value || "";

    try {
      // Just formatting the Whatsapp message, not saving to DB
      const addressDetails = [profile.mainAddress, area, city].filter(Boolean).join(" - ");
      const itemsText = items
        .map(
          (i) =>
            `▪️ ${i.quantity}x ${i.product_name} (${i.size_name}) - ${i.unit_price * i.quantity} ج`,
        )
        .join("\n");

      const orderDetailsText = `
*طلب جديد من كباش* 🐐
━━━━━━━━━━━━━━━
👤 *بيانات العميل:*
• الاسم: ${profile.fullName}
• رقم الهاتف: ${profile.primaryPhone}
• العنوان: ${addressDetails}
${notes ? `• ملاحظات: ${notes}\n` : ""}
🛒 *الطلب:*
${itemsText}

💰 *الدفع:*
• المجموع: ${subtotal} ج
• التوصيل: ${delivery} ج
• *الإجمالي الكلي: ${total} ج*
• طريقة الدفع: نقدًا عند الاستلام
━━━━━━━━━━━━━━━
      `.trim();

      const phone = "201121433451";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(orderDetailsText)}`;
      window.open(url, "_blank");

      clearCart();
      navigate({ to: "/order-confirmation" });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إتمام الطلب، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell eyebrow="الدفع" title="إتمام الطلب">
      <form className="grid gap-8 lg:grid-cols-[1fr_360px]" onSubmit={handleCheckout}>
        <div className="space-y-6">
          <Section title="بيانات التوصيل">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="الاسم" id="name" defaultValue={profile.fullName} required />
              <Field
                label="رقم الهاتف"
                id="phone"
                defaultValue={profile.primaryPhone}
                required
                type="tel"
                pattern="^01[0125][0-9]{8}$"
                title="رقم الهاتف يجب أن يكون رقم مصري صحيح يتكون من 11 رقم ويبدأ بـ 01"
              />
            </div>
            <Field label="العنوان" id="addr" defaultValue={profile.mainAddress} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="المدينة" id="city" />
              <Field label="الحي / المنطقة" id="area" />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold mb-2">
                ملاحظات الطلب
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </Section>

          <Section title="طريقة الدفع">
            <div className="grid sm:grid-cols-3 gap-3">
              <PayOption
                id="cash"
                label="نقدًا عند الاستلام"
                icon={Banknote}
                active={true}
                onClick={() => {}}
              />
            </div>
          </Section>
        </div>

        <aside className="rounded-2xl border border-border bg-surface-2/40 p-6 h-fit space-y-3">
          <h2 className="text-lg font-bold mb-2">ملخص الطلب</h2>
          <Row label="المجموع الفرعي" value={`${subtotal} ج`} />
          <Row label="التوصيل" value={`${delivery} ج`} />
          <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold">
            <span>الإجمالي</span>
            <span className="text-primary">{total} ج</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full block text-center rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب"}
          </button>
        </aside>
      </form>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface-2/40 p-6 space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
function Field({
  label,
  id,
  defaultValue,
  required,
  type = "text",
  pattern,
  title,
}: {
  label: string;
  id: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  pattern?: string;
  title?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        id={id}
        defaultValue={defaultValue}
        required={required}
        type={type}
        pattern={pattern}
        title={title}
        className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
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
function PayOption({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon: typeof CreditCard;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-right transition-colors ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
    >
      <Icon className={`h-5 w-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <div className="text-sm font-bold">{label}</div>
    </button>
  );
}
