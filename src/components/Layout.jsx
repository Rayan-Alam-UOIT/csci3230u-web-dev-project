import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, searchQuery, onSearchChange }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <main id="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;