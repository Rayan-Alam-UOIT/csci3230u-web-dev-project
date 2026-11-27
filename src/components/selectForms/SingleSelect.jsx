// AI-assisted - see AI-USAGE.md #<21, 25>

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function SingleSelect({ label, options, value, onChange, emptyLabel }) {
  const { t } = useTranslation();
  const emptyText = emptyLabel ?? t("browse.filters.none");

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

  function choose(newValue) {
    onChange(newValue);
    setOpen(false);
  }

  const selected = options.find((option) => option.value === value);

  return (
    <div
      className={`select-wrapper multi-select${value ? " is-active" : ""}`}
      ref={ref}
    >
      <span>{label}: </span>

      <button
        type="button"
        className="multi-select__button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? t(selected.labelKey) : emptyText}
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
          <li>
            <label>
              <input
                type="radio"
                name={label}
                checked={value === ""}
                onChange={() => choose("")}
                onClick={() => setOpen(false)}
              />
              {emptyText}
            </label>
          </li>

          {options.map((option) => (
            <li key={option.value}>
              <label>
                <input
                  type="radio"
                  name={label}
                  checked={value === option.value}
                  onChange={() => choose(option.value)}
                  onClick={() => setOpen(false)}
                />
                {t(option.labelKey)}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SingleSelect;