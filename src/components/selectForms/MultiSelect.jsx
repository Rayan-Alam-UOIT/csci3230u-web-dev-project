// AI-assisted - see AI-USAGE.md #<21, 25>

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function MultiSelect({ label, options, selected, onChange,  getLabel = (value) => value }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  }

  const summary =
    selected.length === 0
      ? t("browse.filters.all")
      : selected.length === 1
        ? getLabel(selected[0])
        : t("browse.filters.selected", { count: selected.length });

  return (
    <div
      className={`select-wrapper multi-select${selected.length ? " is-active" : ""}`}
      ref={ref}
    >
      <span>{label}: </span>

      <button
        type="button"
        className="multi-select__button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {summary}
      </button>

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>

      {open && (
        <ul className="multi-select__panel">
          {options.map((option) => (
            <li key={option}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                {getLabel(option)}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MultiSelect;