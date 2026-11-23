// AI-assisted - see AI-USAGE.md #21

import MultiSelect from "./selectForms/MultiSelect";
import SingleSelect from "./selectForms/SingleSelect";
import { GENERATIONS, TYPES, CATEGORIES, SORT_OPTIONS } from "../constants/filters";

function FilterPanel({ filters }) {
  const {
    selectedGenerations, setSelectedGenerations,
    selectedTypes, setSelectedTypes,
    selectedCategories, setSelectedCategories,
    sort, setSort,
    hasActiveFilters, resetFilters,
  } = filters;

  return (
    <section className="filters" aria-label="Filters">
    <h2 className="filters-title">
        FILTERS <span className="filters-tagline">· Gotta filter 'em all!</span>
    </h2>

    <div className="filters-row">
        <MultiSelect
        label="Generation"
        options={GENERATIONS}
        selected={selectedGenerations}
        onChange={setSelectedGenerations}
        />

        <MultiSelect
        label="Type"
        options={TYPES}
        selected={selectedTypes}
        onChange={setSelectedTypes}
        />

        <MultiSelect
          label="Category"
          options={CATEGORIES}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        <SingleSelect
        label="Sort"
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
           Clear filters
        </button>
        )}
    </div>
    </section>
  );
}

export default FilterPanel;