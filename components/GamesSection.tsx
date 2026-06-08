import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GamesSection.module.css";

// ── localStorage key (tracks this device's vote only) ─────────────────────
const LS_TEAM = "baby-shower-team";

// ── Animated rolling number ───────────────────────────────────────────────
function RollingNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        exit={{   y:  16, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ display: "inline-block", minWidth: "1.6ch", textAlign: "center" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function GamesSection() {
  const [mounted,   setMounted]   = useState(false);
  const [team,      setTeam]      = useState<"boy" | "girl" | null>(null);
  const [boyCount,  setBoyCount]  = useState(0);
  const [girlCount, setGirlCount] = useState(0);
  const [loading,   setLoading]   = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch current vote totals from API ────────────────────────────────────
  const fetchCounts = useCallback(async () => {
    try {
      const res  = await fetch("/api/votes");
      const data = await res.json();
      setBoyCount(data.boy);
      setGirlCount(data.girl);
    } catch {
      // Silently ignore network errors — counts stay at last known value
    }
  }, []);

  // ── On mount: hydrate local vote + fetch live counts ─────────────────────
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LS_TEAM) as "boy" | "girl" | null;
    setTeam(saved);
    fetchCounts();

    // Poll every 10 s so other visitors' votes appear without a refresh
    pollRef.current = setInterval(fetchCounts, 10_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchCounts]);

  // ── Cast or change vote ───────────────────────────────────────────────────
  async function pickTeam(choice: "boy" | "girl") {
    if (loading) return;
    const prev = team; // previous vote on this device (may be null)
    setLoading(true);

    // Optimistic UI update
    if (prev === "boy")    setBoyCount((c) => Math.max(0, c - 1));
    if (prev === "girl")   setGirlCount((c) => Math.max(0, c - 1));
    if (choice === "boy")  setBoyCount((c) => c + 1);
    if (choice === "girl") setGirlCount((c) => c + 1);
    setTeam(choice);
    localStorage.setItem(LS_TEAM, choice);

    try {
      const res  = await fetch("/api/votes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ team: choice, prev }),
      });
      const data = await res.json();
      // Reconcile with server's authoritative counts
      setBoyCount(data.boy);
      setGirlCount(data.girl);
    } catch {
      // Network error — revert optimistic update
      if (prev === "boy")    setBoyCount((c) => c + 1);
      if (prev === "girl")   setGirlCount((c) => c + 1);
      if (choice === "boy")  setBoyCount((c) => Math.max(0, c - 1));
      if (choice === "girl") setGirlCount((c) => Math.max(0, c - 1));
      setTeam(prev);
      if (prev) localStorage.setItem(LS_TEAM, prev);
      else      localStorage.removeItem(LS_TEAM);
    } finally {
      setLoading(false);
    }
  }

  // ── Remove vote ───────────────────────────────────────────────────────────
  async function clearVote() {
    if (loading || !team) return;
    const prev = team;
    setLoading(true);

    // Optimistic UI update
    if (prev === "boy")  setBoyCount((c) => Math.max(0, c - 1));
    if (prev === "girl") setGirlCount((c) => Math.max(0, c - 1));
    setTeam(null);
    localStorage.removeItem(LS_TEAM);

    try {
      const res  = await fetch("/api/votes", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prev }),
      });
      const data = await res.json();
      setBoyCount(data.boy);
      setGirlCount(data.girl);
    } catch {
      // Revert
      if (prev === "boy")  setBoyCount((c) => c + 1);
      if (prev === "girl") setGirlCount((c) => c + 1);
      setTeam(prev);
      localStorage.setItem(LS_TEAM, prev);
    } finally {
      setLoading(false);
    }
  }

  // ── Bar percentages ───────────────────────────────────────────────────────
  const total   = boyCount + girlCount;
  const boyPct  = total > 0 ? Math.round((boyCount  / total) * 100) : 50;
  const girlPct = total > 0 ? Math.round((girlCount / total) * 100) : 50;

  return (
    <section id="games" className={styles.section}>

      {/* Heading */}
      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Cast Your Vote</h2>
        <p className={styles.subtitle}>What do you think the baby will be?</p>
      </motion.div>

      {/* Card */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >

        {/* ── Vote buttons (before voting) ── */}
        {(!team || !mounted) && (
          <div className={styles.teamButtons}>
            <motion.button
              className={`${styles.teamBtn} ${styles.boyBtn}`}
              onClick={() => pickTeam("boy")}
              disabled={loading}
              whileHover={{ scale: 1.07, boxShadow: "0 10px 30px rgba(107,172,224,0.45)" }}
              whileTap={{ scale: 0.93 }}
            >
              <span className={styles.btnEmoji}>💙</span>
              <span className={styles.btnLabel}>Team Boy</span>
            </motion.button>

            <div className={styles.btnDivider}>or</div>

            <motion.button
              className={`${styles.teamBtn} ${styles.girlBtn}`}
              onClick={() => pickTeam("girl")}
              disabled={loading}
              whileHover={{ scale: 1.07, boxShadow: "0 10px 30px rgba(240,127,160,0.45)" }}
              whileTap={{ scale: 0.93 }}
            >
              <span className={styles.btnEmoji}>💗</span>
              <span className={styles.btnLabel}>Team Girl</span>
            </motion.button>
          </div>
        )}

        {/* ── Voted banner ── */}
        {team && mounted && (
          <AnimatePresence mode="wait">
            <motion.div
              key={team}
              className={`${styles.picked} ${team === "boy" ? styles.pickedBoy : styles.pickedGirl}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{   scale: 0.7,  opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              <motion.span
                className={styles.pickedEmoji}
                animate={{ rotate: [0, -14, 14, -14, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 0.75, delay: 0.15 }}
              >
                {team === "boy" ? "💙" : "💗"}
              </motion.span>
              <p className={styles.pickedText}>
                You&apos;re on <strong>Team {team === "boy" ? "Boy" : "Girl"}!</strong>
              </p>
              <p className={styles.pickedSub}>
                {team === "boy" ? "Blue skies ahead ☁️" : "Pink paradise awaits 🌸"}
              </p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Live tally ─────────────────────────────────────────────────── */}
        {mounted && (
          <motion.div
            className={styles.tally}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* Total */}
            <p className={styles.tallyTitle}>
              🗳️ {total === 0 ? "No votes yet — be the first!" : (
                <>
                  <RollingNumber value={total} />
                  {total === 1 ? " vote cast" : " votes cast"}
                </>
              )}
            </p>

            {/* Boy row */}
            <div className={styles.tallyRow}>
              <span className={styles.tallyEmoji}>💙</span>
              <span className={styles.tallyName}>Boy</span>
              <div className={styles.barTrack}>
                <motion.div
                  className={`${styles.barFill} ${styles.barBoy}`}
                  animate={{ width: total === 0 ? "50%" : `${boyPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <span className={styles.tallyNum}>
                <RollingNumber value={boyCount} />
              </span>
              {total > 0 && (
                <span className={styles.tallyPct}>{boyPct}%</span>
              )}
            </div>

            {/* Girl row */}
            <div className={styles.tallyRow}>
              <span className={styles.tallyEmoji}>💗</span>
              <span className={styles.tallyName}>Girl</span>
              <div className={styles.barTrack}>
                <motion.div
                  className={`${styles.barFill} ${styles.barGirl}`}
                  animate={{ width: total === 0 ? "50%" : `${girlPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
                />
              </div>
              <span className={styles.tallyNum}>
                <RollingNumber value={girlCount} />
              </span>
              {total > 0 && (
                <span className={styles.tallyPct}>{girlPct}%</span>
              )}
            </div>
          </motion.div>
        )}

        {/* Change vote */}
        {team && mounted && (
          <motion.button
            className={styles.changeBtn}
            onClick={clearVote}
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            ↩ Change my vote
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}
