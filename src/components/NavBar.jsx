import { NavLink } from "react-router-dom";
// Using NavLink instead of Link since it auto adds aria-current="page" for active route
// Only useful here since we have a style for the active link

function NavBar() {
   return (
      <nav className="site-nav__list">
         <NavLink className="site-nav__link" to="/" end>
            Pokémon
         </NavLink>

         <NavLink className="site-nav__link" to="/favourites">
            Favourites
         </NavLink>

         <NavLink className="site-nav__link" to="/games">
            Games
         </NavLink>
      </nav>
   );
}

export default NavBar;
