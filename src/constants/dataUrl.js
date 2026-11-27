// AI-assisted - see AI-USAGE.md #<22, 26>

// export const POKEMON_DATA_URL = "/data/sample.json";
export const POKEMON_LIMIT = 1025;
export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
export const GRAPHQL_URL = "https://graphql.pokeapi.co/v1beta2";
export const ARTWORK_URL = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const REST_BATCH_SIZE = 20;
export const LIST_QUERY = `
   query PokemonList($limit: Int!) {
      pokemon(where: { id: { _lte: $limit } }, order_by: { id: asc }) {
         id
         name
         height
         weight
         pokemontypes(order_by: { slot: asc }) { type { name } }
         pokemonspecy {
            is_legendary
            is_mythical
            generation { name }
            pokemonspeciesnames(
               where: { language: { name: { _in: ["en", "fr", "ja", "ja-Hrkt"] } } }
            ) {
               name
               language { name }
            }
         }
      }
   }
`;

export const DETAIL_QUERY = `
   query PokemonDetail($id: Int!) {
      pokemon(where: { id: { _eq: $id } }) {
         id
         name
         height
         weight
         pokemontypes(order_by: { slot: asc }) { type { name } }
         pokemonabilities(order_by: { slot: asc }) { ability { name } }
         pokemonstats(order_by: { stat_id: asc }) { base_stat stat { name } }
         pokemonsprites { sprites }
         pokemonmoves(order_by: [{ move_id: asc }, { version_group_id: asc }]) {
            level
            move { id name type { name } }
            movelearnmethod { name }
            versiongroup { name }
         }
         pokemonspecy {
            is_legendary
            is_mythical
            generation { name }
            pokemonegggroups { egggroup { name } }
            pokemonspeciesflavortexts(
               where: { language: { name: { _eq: "en" } } }
               order_by: { version_id: asc }
               limit: 1
            ) { flavor_text }
         }
      }
   }
`;
export const SPRITES_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/";
export const CRY_URL = (id) => `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;