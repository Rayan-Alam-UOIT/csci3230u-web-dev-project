/* AI-assisted - see AI-USAGE.md #<14> */

import NavBar from "./NavBar";
import { Link } from "react-router-dom";

function Header({ searchQuery, onSearchChange, showSearch = true }) {
   return (
      <header className="site-header">
         <Link className="site-header__brand" to="/">
            <span className="site-header__logo">POKÉWEB</span>

            <img
               className="site-header__icon-img"
               src="/images/Poké_Ball_icon.svg"
               alt=""
            />
         </Link>

         <NavBar />

         {showSearch && (
            <search>
               <form
                  className="site-search"
                  onSubmit={(event) => event.preventDefault()}
               >
                  <label htmlFor="site-search" className="visually-hidden">
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
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                     />
               </form>
            </search>
         )}
      </header>
   );
}

export default Header;
