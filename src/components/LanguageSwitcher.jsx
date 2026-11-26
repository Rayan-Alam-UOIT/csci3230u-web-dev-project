import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants/languages";

function LanguageSwitcher() {
   const { t, i18n } = useTranslation();

   return (
      <div className="language-switcher">
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
      </div>
   );
}

export default LanguageSwitcher;