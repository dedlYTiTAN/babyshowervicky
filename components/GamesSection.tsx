import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GamesSection.module.css";

// ── localStorage keys ─────────────────────────────────────────────────────
const LS_TEAM = "baby-shower-team";
const LS_BOY  = "baby-shower-sim-boy";
const LS_GIRL = "baby-shower-sim-girl";

// Starting base counts — feel free to change these
const BASE_BOY  = 14;
const BASE_GIRL = 17;

// Maximum total votes across both teams (simulation stops here)
const MAX_TOTAL = 35;

// How often (ms) a simulated vote ticks in — random between MIN and MAX
const TICK_MIN = 20_000;   // 20 seconds
const TICK_MAX = 45_000;   // 45 seconds

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
  const [boyCount,  setBoyCount]  = useState(BASE_BOY);
  const [girlCount, setGirlCount] = useState(BASE_GIRL);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Schedule the next random auto-tick ───────────────────────────────────
  function scheduleNext(boy: number, girl: number) {
    // Stop ticking once total reaches the cap
    if (boy + girl >= MAX_TOTAL) return;

    const delay = TICK_MIN + Math.random() * (TICK_MAX - TICK_MIN);
    timerRef.current = setTimeout(() => {
      // Randomly add 1 to either boy or girl
      const addToBoy = Math.random() < 0.5;
      const newBoy  = addToBoy ? boy  + 1 : boy;
      const newGirl = addToBoy ? girl : girl + 1;
      // Double-check cap (in case a real guest vote pushed us over)
      if (newBoy + newGirl > MAX_TOTAL) return;
      setBoyCount(newBoy);
      setGirlCount(newGirl);
      // Persist so counts survive a page refresh
      localStorage.setItem(LS_BOY,  String(newBoy));
      localStorage.setItem(LS_GIRL, String(newGirl));
      scheduleNext(newBoy, newGirl);
    }, delay);
  }

  // ── On mount: restore persisted counts + start the ticker ────────────────
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LS_TEAM) as "boy" | "girl" | null;
    setTeam(saved);

    // Restore previously stored sim counts (so they never go backwards)
    const storedBoy  = parseInt(localStorage.getItem(LS_BOY)  ?? "", 10);
    const storedGirl = parseInt(localStorage.getItem(LS_GIRL) ?? "", 10);
    const boy  = isNaN(storedBoy)  ? BASE_BOY  : storedBoy;
    const girl = isNaN(storedGirl) ? BASE_GIRL : storedGirl;
    setBoyCount(boy);
    setGirlCount(girl);

    scheduleNext(boy, girl);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cast or change vote ───────────────────────────────────────────────────
  function pickTeam(choice: "boy" | "girl") {
    const prev = team;

    // Undo previous vote
    if (prev === "boy")  setBoyCount((c) => { const n = Math.max(0, c - 1); localStorage.setItem(LS_BOY,  String(n)); return n; });
    if (prev === "girl") setGirlCount((c) => { const n = Math.max(0, c - 1); localStorage.setItem(LS_GIRL, String(n)); return n; });

    // Add new vote
    if (choice === "boy")  setBoyCount((c)  => { const n = c + 1; localStorage.setItem(LS_BOY,  String(n)); return n; });
    if (choice === "girl") setGirlCount((c) => { const n = c + 1; localStorage.setItem(LS_GIRL, String(n)); return n; });

    setTeam(choice);
    localStorage.setItem(LS_TEAM, choice);
  }

  // ── Remove vote ───────────────────────────────────────────────────────────
  function clearVote() {
    if (!team) return;
    if (team === "boy")  setBoyCount((c)  => { const n = Math.max(0, c - 1); localStorage.setItem(LS_BOY,  String(n)); return n; });
    if (team === "girl") setGirlCount((c) => { const n = Math.max(0, c - 1); localStorage.setItem(LS_GIRL, String(n)); return n; });
    setTeam(null);
    localStorage.removeItem(LS_TEAM);
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
              disabled={false}
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
              disabled={false}
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
            disabled={false}
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
