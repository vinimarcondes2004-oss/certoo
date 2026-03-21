import { Link } from "wouter";
import { useSite } from "@/context/SiteContext";

const PINK = "#e8006f";
const DARK_PINK = "#c0003d";

export default function SobreNos() {
  const { data } = useSite();
  const sn = data.sobreNos;

  return (
    <div className="min-h-screen bg-white">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">← Voltar</Link>
          <span className="text-gray-300">|</span>
          {(() => {
            const logo = data.settings.logo || "logo-pr.png";
            const logoSrc = logo.startsWith("data:") || logo.startsWith("http") ? logo : `${import.meta.env.BASE_URL}${logo}`;
            return <img src={logoSrc} alt={data.settings.siteName} className="h-9 w-auto" onError={e => (e.currentTarget.style.display = "none")} />;
          })()}
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${PINK}, ${DARK_PINK})` }} className="text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-4">{sn.heroTagline}</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {sn.heroTitle}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            {sn.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="bg-[#fdf0f6] rounded-2xl p-8 border border-pink-100">
            <p className="text-gray-700 text-lg leading-relaxed">
              {sn.highlight ? (
                <>
                  {sn.heroSubtitle.split(sn.highlight)[0]}
                  <span className="font-semibold" style={{ color: PINK }}>{sn.highlight}</span>
                  {sn.heroSubtitle.split(sn.highlight)[1]}
                </>
              ) : sn.heroSubtitle}
            </p>
          </div>

          <div className="space-y-6 text-gray-600 text-base leading-relaxed">
            <p>{sn.paragraph1}</p>
            <p>{sn.paragraph2}</p>
            {sn.finalMessage && (
              <p className="text-lg font-medium text-gray-800">{sn.finalMessage}</p>
            )}
          </div>

          {/* Valores */}
          {sn.values && sn.values.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {sn.values.map(v => (
                <div key={v.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-center">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center pt-6">
            <Link
              href="/produtos"
              className="inline-block text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition"
              style={{ backgroundColor: PINK }}
            >
              {sn.ctaText || "Conheça nossos produtos"}
            </Link>
          </div>

        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6 px-6 text-center">
        <p className="text-gray-400 text-xs">{data.settings.footerCopyright}</p>
      </footer>
    </div>
  );
}
