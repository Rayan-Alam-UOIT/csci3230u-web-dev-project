import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PokemonProvider } from "./context/PokemonContext";
import BrowsePage from "./pages/BrowsePage";
import FavouritesPage from "./pages/FavouritesPage";
import GamePage from "./pages/GamePage";
import DetailPage from "./pages/DetailPage";

function App() {
   const [searchQuery, setSearchQuery] = useState("");

   return (
      <PokemonProvider>
         <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
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
               <Route path="/games" element={<GamePage />} />
               <Route path="/pokemon/:id" element={<DetailPage />} />
               <Route path="*" element={<p>Page not found.</p>} />
            </Routes>
         </Layout>
      </PokemonProvider>
   );
}

export default App;
