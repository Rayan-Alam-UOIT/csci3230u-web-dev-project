## Log

### #1 - Setup vitest
- **Date:** 2026-11-05
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** free-tier Gemini (3.6 Thinking)
- **Files:** `vite.config.js` + `test/setup.js`
- **Prompt (verbatim):**

```
how can I use the vitest + react testing library for my project 
```
- **What it produced & what I changed:** It found commands for me to run to setup vitest plus it gave me new code to add to the config file for testing and the setup.js code to auto-cleanup the DOM.

## Log

### #2 - Generate vitests for important logic
- **Date:** 2026-11-05
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** free-tier Cursor (Grok 4.7 Medium)
- **Files:** `src/components/**/*.test.jsx`
- **Prompt (verbatim):**

```
As you can see from my recent commit, I have started setting up vitest and the React testing library. I wanted to ask you what do you think are the most important components or logics that are the most core/important things to create tests for?
```
follow-up prompt:
```
Please implement the one interaction tests for each of the 4 components.
```

- **What it produced & what I changed:** It recommended testing 4 components and I asked it to make them. Those 4 being MultiSelect, Pagination, PokemonCard, and FilterPanel. 
What I kept was everything it produced. I added comments (got helped by Cursor auto-fill by accident.)