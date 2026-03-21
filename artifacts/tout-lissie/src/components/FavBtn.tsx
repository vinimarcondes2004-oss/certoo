import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

const PINK = "#e8006f";

export function FavBtn({ productId }: { productId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(productId);
  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(productId); }}
      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition"
    >
      <Heart
        size={14}
        fill={fav ? PINK : "none"}
        stroke={fav ? PINK : "#aaa"}
      />
    </button>
  );
}

export function FavIconBtn({ className = "" }: { className?: string }) {
  const { totalFavorites, openFavorites } = useFavorites();
  return (
    <button onClick={openFavorites} className={`relative p-1.5 ${className}`}>
      <Heart size={20} className="text-gray-700" />
      {totalFavorites > 0 && (
        <span
          className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
          style={{ background: PINK }}
        >
          {totalFavorites > 9 ? "9+" : totalFavorites}
        </span>
      )}
    </button>
  );
}
