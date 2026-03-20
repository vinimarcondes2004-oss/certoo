import { X, Heart, Trash2, ShoppingCart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/SiteContext";

const PINK = "#e8006f";

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

export function FavoritesDrawer() {
  const { favorites, isOpen, closeFavorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { data } = useSite();

  const favProducts = data.products.filter(p => favorites.includes(p.id));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeFavorites}
        />
      )}

      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Heart size={20} style={{ color: PINK }} fill={PINK} />
            <span className="font-black text-gray-900 text-lg">Favoritos</span>
            {favProducts.length > 0 && (
              <span className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: PINK }}>
                {favProducts.length}
              </span>
            )}
          </div>
          <button onClick={closeFavorites} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {favProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
              <Heart size={32} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-700 text-lg">Nenhum favorito ainda</p>
            <p className="text-gray-400 text-sm">Toque no coração dos produtos para salvá-los aqui</p>
            <button
              onClick={closeFavorites}
              className="text-white font-bold rounded-full px-7 py-2.5 text-sm hover:opacity-90 transition mt-2"
              style={{ background: PINK }}
            >
              Explorar produtos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {favProducts.map(product => (
              <div key={product.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3">
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(145deg, ${product.color}18, ${product.color}35)` }}
                >
                  <img src={imgSrc(product.img)} alt={product.name} className="w-14 h-14 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 leading-tight mb-0.5 truncate">{product.name}</p>
                  {product.ml && (
                    <p className="text-xs text-gray-400 mb-1">{product.ml}</p>
                  )}
                  <p className="font-black text-sm" style={{ color: PINK }}>{product.price}</p>
                  <button
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price, img: product.img, color: product.color });
                      closeFavorites();
                    }}
                    className="mt-2 flex items-center gap-1 text-xs font-bold rounded-full px-3 py-1 text-white hover:opacity-90 transition"
                    style={{ background: PINK }}
                  >
                    <ShoppingCart size={11} />
                    Adicionar
                  </button>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="self-start p-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={15} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
