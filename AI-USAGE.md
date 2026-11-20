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

## Log

### #5 - Pokédex Descriptions and Evolution Chain

- **Date:** 2026-11-09
- **Member:** Rayan Alam
- **Tool / model:** free-tier ChatGPT (GPT-5.6 Luna)
- **Files:** `src/utils/pokemonMapper.js`, `src/pages/DetailPage.jsx`, `src/components/EvolutionChain.jsx`, and related CSS
- **Prompt (verbatim):**

```text
I want to improve the Pokémon Detail Page by adding Pokédex descriptions and an Evolution Chain section. The descriptions should come from PokéAPI species data, and the evolution chain should show how each Pokémon evolves. Can you help me implement these features while keeping the layout responsive and consistent with the existing design?
```

- **What it produced & what I changed:** ChatGPT helped with extracting and formatting English Pokédex descriptions from PokéAPI species data and displaying them on the Detail Page. It also assisted with the Evolution Chain section and its integration into the page. I adjusted the layout and styling to keep both sections visually consistent, preserved the original Pokémon artwork, and normalized description text to handle unusual capitalization and line breaks.

## Log

### #6 - Improve Base Stats and Moves Layout

- **Date:** 2026-11-09
- **Member:** Rayan Alam
- **Tool / model:** free-tier ChatGPT (GPT-5.6 Luna)
- **Files:** `src/pages/DetailPage.jsx` + Detail Page CSS
- **Prompt (verbatim):**

```
I want to improve the formatting of the Base Stats and Moves cards on the Pokémon Detail Page. The cards are currently too tall, and longer move names wrap awkwardly because of the column layout. Can we make both sections more compact, responsive, and easier to read while keeping the existing move-type colours?
```

- **What it produced & what I changed:** ChatGPT suggested replacing the existing grids with separate responsive layouts for Base Stats and Moves. It also identified unnecessary CSS padding contributing to the excessive card height. I implemented the new layouts and added a Show All / Show Less button to initially display only 12 moves. I adjusted the styling and fixed an issue where the `moves` variable was referenced before initialization, causing the Detail Page to render blank.

---

## Log

### #7 - Improve Pokémon Cry Player

- **Date:** 2026-11-09
- **Member:** Rayan Alam
- **Tool / model:** free-tier ChatGPT (GPT-5.6 Luna)
- **Files:** `src/pages/DetailPage.jsx` + Detail Page CSS
- **Prompt (verbatim):**

```
Could we slightly enhance the design of the Play Cry button on the Pokémon Detail Page? I want a cleaner button with an icon and a subtle audio progress indicator, while keeping the existing useCry hook and overall website styling.
```

- **What it produced & what I changed:** ChatGPT suggested a redesigned Play Cry button with a Font Awesome icon, a playing state, and a slimmer progress bar. I implemented the JSX and CSS changes while keeping the existing `useCry` functionality. I also removed the bouncing hover animation because I preferred a simpler hover effect with only a border colour change.

---

## Log

### #8 - Additions to Root

- **Date:** 2026-11-14
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `detail-styles.css`, `game-styles.css`, `global-styles.css`
- **Prompt (verbatim):**

```
Please help me turn my font sizes, colours, and other properties in my css files into root variables. Provide the updated root as well as what to change in each of my css files.
```

- **What it produced & what I changed:** It provided an updated `:root` for my `global-styles.css` which I replaced my original with. This new `:root` had new variables for text, background, and border colours; badge colours, font sizes, shapes, sizing, and transitions. Claude told me every rule in `detail-styles.css`, `game-styles.css`, `global-styles.css` to change to use our new root variables. After Claude's changes, I moved the filter CSS rules to it's own file (`filter-styles.css`) so that the `global-styles.css` is less cluttered and more easy to read. I re-organized the CSS rules across all the files so that the rules for each component are lumped together (e.g., all the CSS rules for the Game Picker Cards in the Game Page can be found under a comment `/* ---------- Game Picker Cards ---------- */` in `game-styles.css`). For `detail-styles.css`, I made new CSS rules for `artwork-shiny-...` for the official shiny Pokemon artwork used in the head. Before, both that artwork and the sprites at the bottom of the Detail Page used the same rules, which could cause issues long term if we want to change those rules for only one of them.

---

## Log

### #9 - Turning Evolution Chain into a Tree
- **Date:** 2026-11-15
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `useEvolutionChain.js`, `EvolutionChain.jsx`
- **Prompt (verbatim):**

```
So I have this js and JSX code here. And the code works well for the most part. For a Pokemon like Bulbasaur, it perfectly shows it's evolution line. However, they are other Pokemon, like for example Slowpoke, which can evolve into two separate Pokemon. And this current code does not capture that well. It displays it still as a line, as if Slowpoke -> Slowbro -> Slowking. How can we change this code to reflect this, while still keeping the structure for pokemon like Bulbasaur?
```
- **What it produced & what I changed:** It produced a new helper function (`buildTree`) for the `useEvolutionChain.js` hook that keeps the tree structure of some Pokemon's evolutions. Previously, the code would flatten a Pokemon's evolutions, so for Pokemon with branching evolutions, the sructure would be lost. It produced changes to `EvolutionChain.jsx` to follow the new structure of `useEvolutionChain.js`. In addition to the necessary changes to the JSX code to work with the new hook structure, Claude also changed `EvolutionChain.jsx` to have `EvolutionCard` and `EvolutionNode` be separate functions. I considered reversing that but I thought keeping it was for the best. Finally, Claude produced new CSS classes for the changes it made to JSX. While the code was no longer flattening the evolution list, Claude's code still did not display the Pokemon's evolution list correctly. For small screens, the evolution list would expand outside the box. I fixed this by changing the flex property of Claude's new classes (making `evolution-node`, `evolution-method`, and `evolution-branch` flexboxes). After this, there was still an issue for Pokemon with two or more evolutions, where it only shows the branching behaviour for the first two evolutions:
E.g.,
  ```
   Eevee
    \/               \/
  Vaporeon        Jolteon
    \/               \/
  Flareon          Espeon
    \/               \/
    ...              ...
  ```
  I fixed this by making a new hook, `useMediaQuery.js`, so that for small screens, a copy of the child Pokemon is made for every two branching evolutions. So it's displayed on the screen like the following:
  ```
   Eevee
    \/               \/
  Vaporeon        Jolteon

   Eevee
    \/               \/
  Flareon          Espeon
  ```

---

## Log

### #10 - Carry Favourites Order into the Detail Page

- **Date:** 2026-11-15
- **Member:** Wingfung Hu
- **Tool / model:** free-tier ChatGPT (GPT-5.6 Luna)
- **Files:** `src/pages/FavouritesPage.jsx`, `src/components/PokemonGrid.jsx`, `src/components/PokemonCard.jsx`, `src/pages/DetailPage.jsx`, and `src/hooks/usePokemonNavigation.js`
- **Prompt (verbatim):**

```
Currently, when the user clicks the Detail Page from one of their Pokemon in Favourites, the next Pokemon button takes them to the next Pokemon in the entire Pokemon list. Rather, it should take them to the Detail Page for the next Pokemon in the Favourites list (and vice versa for the previous pokemon). How would you implement it?
```

- **What it produced & what I changed:** It suggested passing the favourites’ Pokémon IDs through the detail link state so the Detail Page could navigate within the favourites list. I implemented the changes in these files:
   1. `src/pages/FavouritesPage.jsx` - Passed the IDs of all favourite Pokémon to `PokemonGrid`.
   2. `src/components/PokemonGrid.jsx` - Accepted the `navigationIds` prop and passed it to each `PokemonCard`.
   3. `src/components/PokemonCard.jsx` - Included `navigationIds` and the originating pathname in the detail links’ router state.
   4. `src/pages/DetailPage.jsx` - Read `navigationIds` from the router state and passed them to `usePokemonNavigation`. The previous/next links preserve that state when navigating between detail pages.
   5. `src/hooks/usePokemonNavigation.js` - Used the provided IDs to find the previous and next Pokémon among the favourites. When no IDs are provided, it continues to navigate through the full Pokémon list.

---

## Log

### #11 - Sprites & Cry Section Layout

- **Date:** 2026-11-15
- **Member:** Rayan Alam
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `src/pages/DetailPage.jsx` + `detail-styles.css`
- **Prompt (verbatim):**

```
Currently the sprites layout on desktop for the Pokemon on the Detail Page leaves a gap and weird formatting if some Pokemon don't have a certain sprite, and some Pokemon don't have sprites at all. How can we fix the formatting and also the placement of the Play Cry button relative to the sprites? I don't want to mess anything up, so any new CSS should replace the old CSS instead of just being added at the bottom, but tell me which ones.
```

follow-up prompts:

```
The sprites look cleaner formatted now but the cry player needs to be formatted better for the new sprites.
```

```
I don't like the border top thing but I do like the Play Cry being underneath the sprites. The icon in Play Cry is too close to the text, and I want the Sprites & Cry text to be the same size as the Moves and Base Stats text.
```

```
If we were to put the sprites and cry into a card section the same way as the other ones like Description and Moves, would that be better?
```

- **What it produced & what I changed:** It explained that the gaps came from a fixed 2-column grid for the sprite groups and stretchy `flex: 1 1 0` sprite items, then gave replacement CSS rules so the groups wrap naturally and each sprite has a fixed width. A missing sprite or sprite group no longer leaves a hole. It moved the Play Cry player into its own row underneath the sprites, with the button and bar side by side. It also fixed the icon spacing (a desktop `gap: 0` override), matched the Sprites & Cry heading to the Base Stats and Moves headings, and suggested turning the section into a card by reusing the existing `.body` class. I tried a divider line above the cry player but removed it because I didn't like it. When the spacing between the sprites and the cry button didn't change, we found the base `.sprites-row` rule had lost its `display: flex`, so I restored it. I applied the card change by adding the `body` class to the sprites section in `DetailPage.jsx`.

---

## Log

### #12 - Evolution Chain Hover Fix and Branching Layout

- **Date:** 2026-11-15
- **Member:** Rayan Alam
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `detail-styles.css`
- **Prompt (verbatim):**

```
I want to focus on fixing the evolution tree design. First off, when hovering, a bit of the top of the evolution card gets cut off. Second, for Pokemon that can have several different evolutions like a branch instead of a single chain (Eevee for example), how can we format it better but keep the normal chain for normal evolutions?
```

follow-up prompts:

```
For Eevee's evolution branch or any with a lot of different things, it still looks like a linear evolution for some of the evolutions, is there any way around that or no?
```

```
I don't understand the black line thing, is it supposed to look like that? Also give me some other Pokemon to test how this looks.
```

- **What it produced & what I changed:** It explained that the hover cut-off was caused by `overflow-x: auto` on `.evolution-list` clipping the card's upward lift, and fixed it with vertical padding. For Pokémon with 4 or more branches (Eevee), it added CSS using `:has(> :nth-child(4))` so the branches form a 2-column grid on tablets and a 3-column grid on large screens, while normal chains keep the existing layout. When Eevee's grid still read like a chain, it removed the arrows, moved the evolution method above each card, and added a bracket line from the base card to the group. It also explained the bracket and gave options to soften or remove it, plus a list of Pokémon to test (Eevee, Tyrogue, Wurmple, Slowpoke, Charmander, Ditto). [Update this line with what you did with the bracket line, e.g. softened it with `--color-border-subtle` or removed it.] I confirmed that regular chains were unaffected.


---

## Log

### #13 - Organize Moves by Learn Method

- **Date:** 2026-11-15
- **Member:** Rayan Alam
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `src/utils/pokemonMapper.js`, `src/utils/moveUtils.js` (new), `src/pages/DetailPage.jsx`, `detail-styles.css`
- **Prompt (verbatim):**

```
If we wanted to take the moves and organize them by how they can be unlocked or whatever, is that possible with the PokeAPI?
```

follow-up prompts:

```
So what are the necessary changes so that we can visually categorize the moves?
```

```
Before clicking show more we should limit to showing 12 or however many we had showing before, because that's the whole purpose since there are too many moves. Also, clicking show more and then going to another Pokemon shows all the moves for them as well instead of resetting to show more.
```

- **What it produced & what I changed:** It confirmed PokéAPI includes `version_group_details` for each move (learn method, level and game), and that the data was being dropped when `pokemonMapper.js` reduced each move to `{ name, url }`. It gave me an updated mapper line that keeps those details, and a new `moveUtils.js` with the method order and labels (Level Up, TM / HM, Egg, Tutor), a game ordering so the newest game is the default, and helpers that group moves by game and method. In `DetailPage.jsx` it added a game dropdown, grouped move sections with "Lv. N" on level-up moves, and the supporting CSS. For my follow-up, it made the 12-move limit apply across all categories instead of per category, and reset "Show All" when navigating to another Pokémon. I implemented the changes and fixed two mistakes of my own: the mapper used `pokemon.moves` instead of `rawPokemon.moves`, and `useMemo` was missing from the React import in `DetailPage.jsx`. I kept the 12-move cap shared across categories.

---

## Log

### #14 - Hiding Search Bar on pages

- **Date:** 2026-11-17
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `Layout.jsx`, `App.jsx`
- **Prompt (verbatim):**

```
Hello

I have this Header component with a search bar

I want that on the Detail Page and Games Page, the search bar is not shown
```

- **What it produced & what I changed:** It provided an updated `Layout.jsx` that has a new boolean `hideSearch`, which is `true` if the current location is the Detail Page or the Games Page. `hideSearch` is passed into the `Header` component. I did NOT pass Claude `Header.jsx` so it was not able to provide an updated version of the component. However it did say what changes would have to be made. It said to include `showSearch` has a parameter in the `Header` component and to wrap the input around the `showSearch` boolean, both of which I did. One issue I noticed when running the updated app is that while the search bar is no longer shown on the Detail Page or Games Page, the magnifying glass icon to the left of the bar is still shown. I had to change the `Header.jsx` to wrap the entire `search` component around the `showSearch` boolean to remove the icon as well.

---

## Log

### #15
- **Date:** 2026-11-17
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** Google Search AI
- **Files:** `src/hooks/useEvolutionChain.js`
- **Prompt (verbatim):**

  ```
  I just realized this use effect captures a lot more, how to fix this?:
  <The code in the file>
  ```

- **What it produced & what I changed:** It produced the code needed to fix the pylint issues. I copied them verbatim and tested that this hook works as intended still

---

## Log

### #16
- **Date:** 2026-11-17
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** Google Search AI
- **Files:** `src/hooks/useMediaQuery.js`
- **Prompt (verbatim):**

  ```
  <after log #15>
  Am I doing it right for this?:
  <The code in the function>
  ```

- **What it produced & what I changed:** It produced the code needed to fix the pylint issues. I copied them verbatim and tested that this hook works as intended still

---

## Log

### #17
- **Date:** 2026-11-17
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** Google Search AI
- **Files:** `src/hooks/useMoveTypes.js`
- **Prompt (verbatim):**

  ```
  <after log #16>
  Please fix the synch set method pylint error here, please:
  <The code in the file>
  ```

- **What it produced & what I changed:** It produced the code needed to fix the pylint issues. I copied them verbatim and tested that this hook works as intended still

---

## Log

### #18
- **Date:** 2026-11-17
- **Member:** Aryan Kashefi-Aazam
- **Tool / model:** Google Search AI
- **Files:** `src/pages/DetailsPage.jsx`
- **Prompt (verbatim):**

  ```
  <after log #17>
  I think I fixed it. I had this:
  <The code in the function>
  ```

- **What it produced & what I changed:** It produced the code needed to fix the pylint issues. I copied them verbatim and tested that this hook works as intended still

---

## Log

### #19 - Detail Page Sprites on Firefox

- **Date:** 2026-11-20
- **Member:** Mason Shipton
- **Tool / model:** free-tier Claude (Claude Sonnet 5.5)
- **Files:** `DetailPage.jsx`, `detail-styles.css` (Sprites section only)
- **Prompt (verbatim):**

```
Hello

I have this attached Detail Page

With this attached CSS for the sprites section

I am finding that on Firefox, the sprites are being smushed together. I don't seem to have this issue on Chrome. Any ideas what the issue is?
```

- **What it produced & what I changed:** It suggested that the issue had to do with the `min-width` of sprites components being set to 0. That removes the automatic minimum size that normally stops a flex item from shrinking below its contents. Chrome and Firefox resolve the `max-content` width of nested flex containers a little differently. If Firefox gives a group a width narrower than its non-wrapping `.sprites-list`, the `5rem` items overflow their group and overlap the next one, producing the appearance that the sprites are smushed together. It produced updated CSS for the sprites in the `@media` query. This included changing `flex` in `.sprite-groups` from `0 1 auto` to `1 1 auto`, chagning `flex` in `.sprite-group` from `0 0 auto` to `0 1 auto` and adding `min-width: auto` to `.sprite-group`, adding `flex-wrap: wrap` to `.sprites-list`, and adding `min-width: auto` to `.sprite-item`. However, while this fixed the issue of sprites smushing together, the sprites were still organized differently on Firefox compared to Chrome and the VSCode Integrated Browser. For large screens (laptops and desktops), the sprites are suppose to be organized with two games per row and the sprites in a row beneath each game. This is the case for Chrome and other browsers, but for Firefox, it shows three games per row with the sprites NOT in a row beneath each game. So I had to make some of my own changes after. I reversed the changes to `.sprite-group` and added `width: max-content` and `max-width: 100%`. I made `.sprites-list` a `grid` and added `width: max-content`. I removed `flex` from `.sprite-item` and added `min-width: 0`. This fixed the organization issue while still preventing the sprites from appearing smushed together.