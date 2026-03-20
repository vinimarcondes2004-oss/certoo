// @refresh reset
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  totalFavorites: number;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "tout-lissie-favorites";

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  function toggleFavorite(id: string) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      totalFavorites: favorites.length,
      toggleFavorite,
      isFavorite,
      isOpen,
      openFavorites: () => setIsOpen(true),
      closeFavorites: () => setIsOpen(false),
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
