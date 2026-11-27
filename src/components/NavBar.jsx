// AI-assisted - see AI-USAGE.md #24

import { Link, matchPath, useLocation } from "react-router-dom";
import { LINKS } from "../constants/navLinks";
import { useTranslation } from "react-i18next";

function NavBar() {
   const { t } = useTranslation();
   const { pathname, state } = useLocation();

   const onDetail = Boolean(matchPath("/pokemon/:id", pathname));

   const detailOrigin = state?.from ?? "/";

   function isActive(to) {
      if (onDetail) {
         if (to === "/") {
            return (
               detailOrigin === "/" ||
               detailOrigin.startsWith("/page/")
            );
         }

         return (
            detailOrigin === to ||
            detailOrigin.startsWith(`${to}/`)
         );
      }

      if (to === "/") {
         return pathname === "/" || pathname.startsWith("/page/");
      }

      return pathname === to || pathname.startsWith(`${to}/`);
   }

   return (
      <nav className="site-nav__list">
         {LINKS.map(({ to, labelKey }) => {
            const active = isActive(to);

            return (
               <Link
                  key={to}
                  to={to}
                  className={`site-nav__link${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
               >
                  {t(labelKey)}
               </Link>
            );
         })}
      </nav>
   );
}

export default NavBar;
