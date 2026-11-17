import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, searchQuery, onSearchChange }) {
  const { pathname } = useLocation();

  const hideSearch = (pathname === "/games") || (pathname.startsWith("/pokemon/"));

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} showSearch={!hideSearch} />

      <main id="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;