import { useState } from "react";
import Layout from "./components/Layout";
import BrowsePage from "./pages/BrowsePage";
import FavouritesPage from "./pages/FavouritesPage";
import GamePage from "./pages/GamePage";
import DetailPage from "./pages/DetailPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <BrowsePage searchQuery={searchQuery}/>
    </Layout>
  );
}

export default App;