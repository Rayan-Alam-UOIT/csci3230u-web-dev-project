import DataStatus from "../components/DataStatus";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import PokemonGrid from "../components/PokemonGrid";
import { usePokemon } from "../context/PokemonContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavourites } from "../hooks/useFavourites";
import { usePokemonBrowser } from "../hooks/usePokemonBrowser";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BrowsePage({ searchQuery = "", onSearchChange }) {
   const { page: pageParam } = useParams();
   const navigate = useNavigate();
   const routePage = Math.max(1, Number(pageParam) || 1);

   const goToPage = useCallback(
      (page) => navigate(page === 1 ? "/" : `/page/${page}`),
      [navigate],
   );

   useDocumentTitle("Pokéweb - Browse Pokémon");

   const { pokemonData: pokemon, status, retry } = usePokemon();
   const { isFavourite, toggleFavourite } = useFavourites();

   const { filters, page, totalPages, pageItems, resultCount } =
      usePokemonBrowser(pokemon, searchQuery, onSearchChange, {
         page: routePage,
         onPageChange: goToPage,
      });

   const pokemonWithFavourites = pageItems.map((item) => ({
      ...item,
      is_favourite: isFavourite(item.id),
   }));

   if (status !== "ok") {
      return (
         <div className="page container">
            <DataStatus status={status} onRetry={retry} />
         </div>
      );
   }

   const hasResults = resultCount > 0;

   return (
      <div className="page container">
         <FilterPanel filters={filters} />

         <h1 className="results-heading">
            Pokémon <span aria-hidden="true">•</span> {resultCount} results
         </h1>

         {!hasResults ? (
            <section
               className="empty-state-area"
               aria-label="No matching favourites"
            >
               <p>No Pokémon match your filters.</p>
            </section>
         ) : (
            <>
               <PokemonGrid
                  pokemon={pokemonWithFavourites}
                  onToggleFavourite={toggleFavourite}
               />

               <Pagination
                  key={page}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
               />
            </>
         )}
      </div>
   );
}

export default BrowsePage;
