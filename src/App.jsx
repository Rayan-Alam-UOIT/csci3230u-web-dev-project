import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PokemonProvider } from "./context/PokemonProvider";
import BrowsePage from "./pages/BrowsePage";

const FavouritesPage = lazy(() => import("./pages/FavouritesPage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));

function App() {
   const [searchQuery, setSearchQuery] = useState("");

   return (
      <PokemonProvider>
         <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            {/* AI-assisted - see AI-USAGE.md #20 */}
            <Suspense fallback={<div className="page container">Loading page...</div>}>
               <Routes>
                  <Route
                     path="/"
                     element={
                        <BrowsePage
                           searchQuery={searchQuery}
                           onSearchChange={setSearchQuery}
                        />
                     }
                  />
                  <Route
                     path="/page/:page"
                     element={
                        <BrowsePage
                           searchQuery={searchQuery}
                           onSearchChange={setSearchQuery}
                        />
                     }
                  />
                  <Route
                     path="/favourites"
                     element={
                        <FavouritesPage
                           searchQuery={searchQuery}
                           onSearchChange={setSearchQuery}
                        />
                     }
                  />
                  <Route
                     path="/favourites/page/:page"
                     element={
                        <FavouritesPage
                           searchQuery={searchQuery}
                           onSearchChange={setSearchQuery}
                        />
                     }
                  />
                  <Route path="/games" element={<GamePage />} />
                  <Route path="/pokemon/:id" element={<DetailPage />} />
                  <Route path="*" element={<p>Page not found.</p>} />
               </Routes>
            </Suspense>
         </Layout>
      </PokemonProvider>
   );
}

export default App;
