import { useEffect, useState } from "react";

const key = "favourites";

function readFavourites() {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [ids, setIds] = useState(readFavourites);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(ids));
  }, [ids]);

  const isFavourite = (id) => ids.includes(id);

  const toggleFavourite = (id) =>
    setIds((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );

  return { favouriteIds: ids, isFavourite, toggleFavourite };
}