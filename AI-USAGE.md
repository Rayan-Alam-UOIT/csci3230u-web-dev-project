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

## Log

### #3 - Refactor the Game Page
- **Date:** 2026-11-08
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `src/pages/GamePage.jsx`
- **Prompt (verbatim):**

```
Hello

I have this attached React file for the Game page of my app

Currently, this one file has several constants, functions for both display as well as the game logic, and this file returns the actual Game Page too. Can we refactor this file into some constants and hooks files, while leaving in the file returning the actual Game Page?

Let me know if you have any questions!
```

- **What it produced & what I changed:** It produced seven files:
1. `Gamepage.jsx` - Reduced to simply the page component and the JSX with all our elements imported in.
2. `Gameconstants.js` - Holds the `GENERATION_NUMBERS`, `MAX_SUGGESTIONS`, `localStorage` keys, the round counts, the distractor count, the minimum Pokemon count, the data URL (`/data/sample.json`), and the artwork path, all previously in `Gamepage.jsx`.
3. `Pokemonutils.js` - Holds the helper functions that were in `Gamepage.jsx` including `normalize`, `capitalize`, `chooseRandomPokemon`, `shuffle`, `createSilhouetteRounds`, `createCluesRounds` and `generateClues`.
4. `Usepokemondata.js` - Holds the hook for fetching the Pokemon data. This fetch was previously in `Gamepage.jsx`.
5. `Usewhosthatpokemon.js` - Holds the hook for the `Who's That Pokemon` game logic.
6. `Usecluesgame.js` - Holds the hook for the `Pokemon Clues` game logic.
7. `Useguessautocomplete.js` - Holds the hook for the guess logic for `Pokemon Clues` including guess input, suggestions list, keyboard navigation, and submission. 

I renamed the files to follow the appropriate casing (lower camel case) and placed them in the appropriate folders. I moved some of the helper functions in `pokemonUtils.js` to hook files so the code is easier to read (e.g., I moved the `createCluesRounds` and `generateClues` functons to `useCluesGame.js`). I realised I could change all the app pages to use the same `usePokemonData` hook for retrieving Pokemon data (all use the same data URL). So I changed `BrowsePage.js`, `DetailPage.js`, and `FavouritesPage.js` to use `usePokemonData` and moved the data URL to it's own constants file `dataURL.js`. I noticed across the three page files lots of very similar code (setting the document title, favourites, the Pokemon browser, etc.) as well as constants and functions defined in the three files that should be in their own constants and hook files. I made constant files including `browseConstants.js` (how many Pokemon to show on each page) and `detailConstants.js` (base stat categories and types of sprites shown) as well as hooks including `useDocumentTitle.js`, `useFavouritePokemon.js`, `usePokemonBrowser.js`, and `usePokemonNavigation.js` (navigating to previous and next Pokemon in the `Detail Page`). All of the app pages are now reduced to simply the page components and any shared logic is defined in constants and hooks that enable easy changes.

## Log

### #4 - Play Cry Hook
- **Date:** 2026-11-08
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `src/pages/DetailPage.jsx`
- **Prompt (verbatim):**

```
Hello

I have this attached DetailPage for my app

I would like to make the play cry audio code as a hook. Please provide that.
```

- **What it produced & what I changed:** It produced a file `Usecry.js`. The file is a hook for playing the audio of a selected Pokemon's cry, which was previously in the `DetailPage.js`. Claude produced also a list of changes to make to the `DetailPage.js` to support the new hook files (note it provided a list of changes to make, rather than simply the updated page file).
I renamed the file to follow the appropriate casing (`useCry.js`) and placed it in the `hooks` folder. I implemented the changes Claude mentioned, which included updating the imports to include the hook and removing the large `useEffect` that previously had all the cry audio logic. The JSX did not have to be changed.