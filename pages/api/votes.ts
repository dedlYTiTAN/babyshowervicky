import type { NextApiRequest, NextApiResponse } from "next";

/**
 * In-memory vote store.
 *
 * Lives at module scope so it persists across requests within the same
 * Node.js process — perfect for a single-event site with moderate traffic.
 *
 * ⚠️  Resets if the server restarts or a new serverless cold-start occurs.
 * For permanent persistence on Vercel, run:
 *   npx vercel kv  →  add KV_REST_API_URL + KV_REST_API_TOKEN env vars,
 *   then swap `store` reads/writes for `kv.get/set`.
 */
const store: { boy: number; girl: number } = { boy: 0, girl: 0 };

export type VoteResponse = { boy: number; girl: number; error?: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VoteResponse>
) {
  // ── GET — return current totals ─────────────────────────────────────────
  if (req.method === "GET") {
    return res.status(200).json({ boy: store.boy, girl: store.girl });
  }

  // ── POST — cast or change a vote ────────────────────────────────────────
  if (req.method === "POST") {
    const { team, prev } = req.body as {
      team: "boy" | "girl" | null;
      prev: "boy" | "girl" | null;
    };

    // Undo previous vote when switching teams
    if (prev === "boy")  store.boy  = Math.max(0, store.boy  - 1);
    if (prev === "girl") store.girl = Math.max(0, store.girl - 1);

    // Apply new vote (team === null means remove vote without replacement)
    if (team === "boy")  store.boy++;
    if (team === "girl") store.girl++;

    return res.status(200).json({ boy: store.boy, girl: store.girl });
  }

  // ── DELETE — remove a vote ───────────────────────────────────────────────
  if (req.method === "DELETE") {
    const { prev } = req.body as { prev: "boy" | "girl" | null };
    if (prev === "boy")  store.boy  = Math.max(0, store.boy  - 1);
    if (prev === "girl") store.girl = Math.max(0, store.girl - 1);
    return res.status(200).json({ boy: store.boy, girl: store.girl });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).json({ boy: 0, girl: 0, error: "Method not allowed" });
}
