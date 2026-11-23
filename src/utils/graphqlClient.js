// AI-assisted - see AI-USAGE.md #22

import { GRAPHQL_URL } from "../constants/dataUrl";
import { RATE_LIMIT_COOLDOWN_MS, ERROR_COOLDOWN_MS } from "../constants/graphqlConstants"

let blockedUntil = 0;

function blockFor(ms) {
   blockedUntil = Math.max(blockedUntil, Date.now() + ms);
}

export function isGraphqlAvailable() {
   return Date.now() >= blockedUntil;
}

export async function graphqlRequest(query, variables, signal) {
   if (!isGraphqlAvailable()) {
      throw new Error("GraphQL is temporarily disabled, use REST");
   }

   try {
      const response = await fetch(GRAPHQL_URL, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ query, variables }),
         signal,
      });

      if (response.status === 429) {
         const retryAfterSeconds = Number(response.headers.get("Retry-After"));
         blockFor(retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : RATE_LIMIT_COOLDOWN_MS);
         throw new Error("GraphQL rate limit reached");
      }

      if (!response.ok) {
         throw new Error(`GraphQL request failed: ${response.status}`);
      }

      const json = await response.json();
      if (json.errors?.length) {
         throw new Error(`GraphQL error: ${json.errors[0].message}`);
      }

      return json.data;
   } catch (error) {
      if (error.name !== "AbortError") blockFor(ERROR_COOLDOWN_MS);
      throw error;
   }
}