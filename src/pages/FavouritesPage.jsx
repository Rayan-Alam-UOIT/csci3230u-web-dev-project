import DataStatus from "../components/DataStatus";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import PokemonGrid from "../components/PokemonGrid";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavouritePokemon } from "../hooks/useFavouritePokemon";
import { usePokemonBrowser } from "../hooks/usePokemonBrowser";

function FavouritesPage({ searchQuery = "", onSearchChange }) {
   useDocumentTitle("Pokéweb - Favourites");

   const { favourites, toggleFavourite, status, retry } = useFavouritePokemon();

   const { filters, page, setPage, totalPages, pageItems, resultCount } =
      usePokemonBrowser(favourites, searchQuery, onSearchChange);

   const favouritePokemon = pageItems.map((item) => ({
      ...item,
      is_favourite: true,
   }));

   if (status !== "ok") {
      return (
         <div className="page container">
            <DataStatus status={status} onRetry={retry} />
         </div>
      );
   }

   const hasFavourites = favourites.length > 0;
   const hasResults = resultCount > 0;

   return (
      <div className="page container">
         <h1 className="page-title">Favourites</h1>

         {hasFavourites && <FilterPanel filters={filters} />}

         <h2 className="results-heading">
            Your saved Pokémon <span aria-hidden="true">•</span>{" "}
            {resultCount === favourites.length
               ? `${favourites.length} favourites`
               : `${resultCount} of ${favourites.length} favourites`}
         </h2>

         {!hasFavourites ? (
            <section className="empty-state-area" aria-label="Empty state area">
               <p>No favourites yet. Save Pokémon to see them here.</p>
            </section>
         ) : !hasResults ? (
            <section
               className="empty-state-area"
               aria-label="No matching favourites"
            >
               <p>No Pokémon match your filters.</p>
            </section>
         ) : (
            <>
               <PokemonGrid
                  pokemon={favouritePokemon}
                  onToggleFavourite={toggleFavourite}
                  navigationIds={favourites.map(({ id }) => id)}
               />

               <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
               />
            </>
         )}
      </div>
   );
}

export default FavouritesPage;
