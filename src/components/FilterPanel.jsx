// AI-assisted - see AI-USAGE.md #<21, 25>

import MultiSelect from "./selectForms/MultiSelect";
import SingleSelect from "./selectForms/SingleSelect";
import { GENERATIONS, TYPES, CATEGORIES, SORT_OPTIONS, GENERATION_REGION_KEYS, } from "../constants/filters";
import { useTranslation } from "react-i18next";

function FilterPanel({ filters }) {
  const { t } = useTranslation();
  const typeLabel = (type) => t(`browse.filters.types.${type.toLowerCase()}`);
  const categoryLabel = (category) =>
    t(`browse.filters.categories.${category.toLowerCase()}`);
  const generationLabel = (generation) => {
    const numeral = generation.split(" · ")[0];
    return `${numeral} · ${t(`browse.filters.regions.${GENERATION_REGION_KEYS[generation]}`)}`;
  };

  const {
    selectedGenerations, setSelectedGenerations,
    selectedTypes, setSelectedTypes,
    selectedCategories, setSelectedCategories,
    sort, setSort,
    hasActiveFilters, resetFilters,
  } = filters;

  return (
    <section className="filters" aria-label={t("browse.filters.label")}>
      <h2 className="filters-title">
        {t("browse.filters.heading")}{" "}
        <span className="filters-tagline">· {t("browse.filters.tagline")}</span>
      </h2>

      <div className="filters-row">
        <MultiSelect
          label={t("browse.filters.generation")}
          options={GENERATIONS}
          selected={selectedGenerations}
          onChange={setSelectedGenerations}
          getLabel={generationLabel}
        />

        <MultiSelect
          label={t("browse.filters.type")}
          options={TYPES}
          selected={selectedTypes}
          onChange={setSelectedTypes}
          getLabel={typeLabel}
        />

        <MultiSelect
          label={t("browse.filters.category")}
          options={CATEGORIES}
          selected={selectedCategories}
          onChange={setSelectedCategories}
          getLabel={categoryLabel}
        />

        <SingleSelect
          label={t("browse.filters.sort")}
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />

        {hasActiveFilters && (
        <button type="button" className="filters-reset" onClick={resetFilters}>            
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
           {t("browse.filters.reset")}
        </button>
        )}
    </div>
    </section>
  );
}

export default FilterPanel;