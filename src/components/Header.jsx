// AI-assisted - see AI-USAGE.md #<14, 20, 21>

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
               width={28}
               height={28}
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

                  <svg
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <circle cx="11" cy="11" r="8" />
                     <path d="m21 21-4.35-4.35" />
                  </svg>

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
