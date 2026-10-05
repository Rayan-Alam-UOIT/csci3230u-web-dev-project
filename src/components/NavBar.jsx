function NavBar() {
  return (
    <nav className="site-nav__list">
      <a
        className="site-nav__link site-nav__link--active"
        href="/"
        aria-current="page"
      >
        Pokémon
      </a>

      <a
        className="site-nav__link"
        href="/pages/favourites-page.html"
      >
        Favourites
      </a>

      <a
        className="site-nav__link"
        href="/pages/game-page.html"
      >
        Games
      </a>
    </nav>
  );
}

export default NavBar;