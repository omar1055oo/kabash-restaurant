import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";
import logo from "@/assets/logo.webp";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 grid gap-10 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <Link to="/" className="flex items-center gap-3" aria-label="كباش">
            <img
              loading="lazy"
              src={logo}
              alt="كباش"
              width={56}
              height={56}
              className="h-14 w-14"
            />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            نكهة خليجية بروح مصرية. مندي، مدفون، مضغوط ودجاج ولحم بنكهات أصيلة.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4">تواصل</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> 19000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> hello@kabash.eg
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> المنيا , بني مزار
            </li>
          </ul>
          <div className="flex items-center gap-2 mt-4">
            <a
              href="#"
              aria-label="انستجرام"
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="فيسبوك"
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-5 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} كباش. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
