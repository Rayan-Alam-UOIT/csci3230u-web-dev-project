// AI-assisted - see AI-USAGE.md #24

import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants/languages";

function LanguageSwitcher() {
   const { t, i18n } = useTranslation();

   return (
      <div className="language-switcher">
         <svg
            className="language-switcher__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
         </svg>

         <label htmlFor="language-select" className="visually-hidden">
            {t("nav.language")}
         </label>

         <select
            id="language-select"
            className="language-switcher__select"
            value={i18n.resolvedLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
         >
            {LANGUAGES.map(({ code, label }) => (
               <option key={code} value={code} lang={code}>
                  {label}
               </option>
            ))}
         </select>

         <svg
            className="language-switcher__chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <path d="m6 9 6 6 6-6" />
         </svg>
      </div>
   );
}

export default LanguageSwitcher;