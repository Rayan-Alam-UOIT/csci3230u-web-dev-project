import NavBar from "./NavBar";

function Header() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="/">
        <span className="site-header__logo">POKÉWEB</span>

        <img
          className="site-header__icon-img"
          src="/images/Poké_Ball_icon.svg"
          alt=""
        />
      </a>

      <NavBar />

      <search>
        <form
          className="site-search"
          action="/search-results-page"
          method="GET"
        >
          <label
            htmlFor="site-search"
            className="visually-hidden"
          >
            Search Pokémon
          </label>

          <i
            className="fa-solid fa-magnifying-glass"
            aria-hidden="true"
          ></i>

          <input
            type="search"
            id="site-search"
            name="q"
            placeholder="Search Pokémon..."
            required
          />
        </form>
      </search>
    </header>
  );
}

export default Header;