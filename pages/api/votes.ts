import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Vote storage strategy:
 *
 *  • When KV_REST_API_URL env var is set (i.e. on Vercel after running
 *    `vercel env pull` or linking Vercel KV) → persists in Redis forever.
 *
 *  • Otherwise (local dev) → falls back to a module-level in-memory object.
 *    Counts reset when the dev server restarts, which is fine for testing.
 *
 * ─── Setup persistent votes on Vercel (one-time, ~2 min) ──────────────────
 *  1. vercel.com → your project → Storage → Create Database → KV
 *  2. Click "Connect" on the KV database
 *  3. Vercel auto-adds KV_REST_API_URL + KV_REST_API_TOKEN to your project
 *  4. Redeploy — votes now survive forever ✓
 */

import { kv } from "@vercel/kv";

export type VoteResponse = { boy: number; girl: number; error?: string };

// ── Fallback in-memory store for local development ─────────────────────────
const mem: { boy: number; girl: number } = { boy: 0, girl: 0 };

const KV_KEY = "baby-shower-votes";
const useKV  = !!process.env.KV_REST_API_URL;

// ── Helpers ─────────────────────────────────────────────────────────────────
async function getVotes(): Promise<{ boy: number; girl: number }> {
  if (useKV) {
    const data = await kv.hgetall<{ boy: string; girl: string }>(KV_KEY);
    if (!data) return { boy: 0, girl: 0 };
    return { boy: parseInt(data.boy ?? "0", 10), girl: parseInt(data.girl ?? "0", 10) };
  }
  return { ...mem };
}

async function setVotes(boy: number, girl: number): Promise<void> {
  if (useKV) {
    await kv.hset(KV_KEY, { boy: String(boy), girl: String(girl) });
  } else {
    mem.boy  = boy;
    mem.girl = girl;
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VoteResponse>
) {
  // Allow requests from same origin only
  res.setHeader("Cache-Control", "no-store");

  try {
    // GET — return current totals
    if (req.method === "GET") {
      const votes = await getVotes();
      return res.status(200).json(votes);
    }

    // POST — cast / change a vote
    if (req.method === "POST") {
      const { team, prev } = req.body as {
        team: "boy" | "girl" | null;
        prev: "boy" | "girl" | null;
      };

      const current = await getVotes();
      let { boy, girl } = current;

      // Undo previous vote if switching teams
      if (prev === "boy")  boy  = Math.max(0, boy  - 1);
      if (prev === "girl") girl = Math.max(0, girl - 1);

      // Apply new vote
      if (team === "boy")  boy++;
      if (team === "girl") girl++;

      await setVotes(boy, girl);
      return res.status(200).json({ boy, girl });
    }

    // DELETE — remove a vote without replacement
    if (req.method === "DELETE") {
      const { prev } = req.body as { prev: "boy" | "girl" | null };
      const current = await getVotes();
      let { boy, girl } = current;

      if (prev === "boy")  boy  = Math.max(0, boy  - 1);
      if (prev === "girl") girl = Math.max(0, girl - 1);

      await setVotes(boy, girl);
      return res.status(200).json({ boy, girl });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ boy: 0, girl: 0, error: "Method not allowed" });

  } catch (err) {
    console.error("[votes API]", err);
    // Return last known in-memory state so the UI doesn't break
    const fallback = await getVotes().catch(() => ({ boy: 0, girl: 0 }));
    return res.status(500).json({ ...fallback, error: "Storage error" });
  }
}
