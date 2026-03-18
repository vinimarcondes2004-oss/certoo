import { Link } from "wouter";

export default function SobreNos() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">← Voltar</Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-800 text-lg tracking-tight">Tout Lissie</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a5c2e] to-[#2e7d44] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-4">Sobre nós</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Cuidado que vai além da estética
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            É sobre autoestima, confiança e bem-estar em todos os momentos do seu dia.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          <div className="bg-[#f5fbf7] rounded-2xl p-8 border border-[#d5f0e0]">
            <p className="text-gray-700 text-lg leading-relaxed">
              Acreditamos que cuidar dos seus fios vai muito além da estética — é sobre{" "}
              <span className="font-semibold text-[#1a5c2e]">autoestima, confiança e bem-estar</span>{" "}
              em todos os momentos do seu dia.
            </p>
          </div>

          <div className="space-y-6 text-gray-600 text-base leading-relaxed">
            <p>
              Somos apaixonados por transformar rotinas simples em experiências incríveis. Por isso,
              desenvolvemos produtos pensados para{" "}
              <span className="font-medium text-gray-800">todos os tipos de cabelo</span>, unindo
              tecnologia, qualidade profissional e resultados reais que você pode ver e sentir.
            </p>

            <p>
              Nossa missão é levar até você o cuidado que antes só existia nos salões, de forma{" "}
              <span className="font-medium text-gray-800">prática, acessível e eficaz</span>. Cada
              fórmula é criada com atenção aos detalhes, para entregar brilho, maciez e saúde aos
              seus fios.
            </p>

            <p className="text-lg font-medium text-gray-800">
              Aqui, cada cliente é único — e o seu cabelo merece esse cuidado especial. ✨
            </p>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              { icon: "🌿", title: "Qualidade", desc: "Fórmulas com ingredientes selecionados e tecnologia profissional." },
              { icon: "💚", title: "Acessibilidade", desc: "O melhor cuidado ao alcance de todas as mulheres." },
              { icon: "✨", title: "Resultado", desc: "Brilho, maciez e saúde visíveis desde a primeira aplicação." },
            ].map(v => (
              <div key={v.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-center">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-6">
            <Link
              href="/produtos"
              className="inline-block bg-[#1a5c2e] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#14492400] transition"
              style={{ backgroundColor: "#1a5c2e" }}
            >
              Conheça nossos produtos
            </Link>
          </div>

        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6 px-6 text-center">
        <p className="text-gray-400 text-xs">© 2026 Tout Lissie. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
