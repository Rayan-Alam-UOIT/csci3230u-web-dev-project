import MultiSelect from "./selectForms/MultiSelect";
import SingleSelect from "./selectForms/SingleSelect";
import { GENERATIONS, TYPES, SORT_OPTIONS } from "../constants/filters";

function FilterPanel({ filters }) {
  const {
    selectedGenerations, setSelectedGenerations,
    selectedTypes, setSelectedTypes,
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

        <SingleSelect
        label="Sort"
        options={SORT_OPTIONS}
        value={sort}
        onChange={setSort}
        />

        {hasActiveFilters && (
        <button type="button" className="filters-reset" onClick={resetFilters}>
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            Clear filters
        </button>
        )}
    </div>
    </section>
  );
}

export default FilterPanel;