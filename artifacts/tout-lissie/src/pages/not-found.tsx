import { Link } from "wouter";

const PINK = "#e8006f";
const DARK_PINK = "#c0003d";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#fdf0f6" }}>
      <div className="text-center max-w-md">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-black shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PINK}, ${DARK_PINK})` }}
        >
          404
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Página não encontrada</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi removida.<br />
          Volte à loja e continue explorando nossos produtos.
        </p>
        <Link href="/">
          <button
            className="text-white font-bold rounded-full px-8 py-3 text-sm hover:opacity-90 transition shadow"
            style={{ background: PINK }}
          >
            Voltar para a loja
          </button>
        </Link>
      </div>
    </div>
  );
}
