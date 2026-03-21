import { Link } from "wouter";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const PINK = "#e8006f";

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

export function SharedFooter() {
  const { data } = useSite();
  const logo = data.settings.logo || "logo-pr.png";
  const instaUrl = data.settings.instagram || "";
  const fbUrl = data.settings.facebook || "";
  const waUrl = data.settings.whatsapp ? `https://wa.me/${data.settings.whatsapp}` : "";
  const productLinks = data.footerLinks.filter(l => l.column === "products");
  const companyLinks = data.footerLinks.filter(l => l.column === "company");
  const supportLinks = data.footerLinks.filter(l => l.column === "support");
  const paymentMethods = (data.settings.paymentMethods || "Visa,Master,Pix,Boleto")
    .split(",").map(s => s.trim()).filter(Boolean);

  return (
    <footer style={{ background: PINK }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-3">
              <img src={imgSrc(logo)} alt={data.settings.siteName} className="h-10 w-auto"
                onError={e => (e.currentTarget.style.display = "none")} />
            </div>
            <p className="text-white/75 text-sm leading-relaxed mb-4">{data.settings.footerAbout}</p>
            <div className="flex gap-3">
              {instaUrl && (
                <a href={instaUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Instagram size={15} />
                </a>
              )}
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Facebook size={15} />
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <MessageCircle size={15} />
                </a>
              )}
            </div>
          </div>

          {productLinks.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Produtos</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                {productLinks.map(item => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {companyLinks.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Empresa</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                {companyLinks.map(item => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {supportLinks.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Suporte</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                {supportLinks.map(item => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-white/20 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-white/60 text-xs">{data.settings.footerCopyright}</p>
            <Link href="/admin" className="text-white/30 text-xs hover:text-white/60 transition">Admin</Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-white/50 text-xs">Pagamentos:</span>
            {paymentMethods.map(p => (
              <span key={p} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
