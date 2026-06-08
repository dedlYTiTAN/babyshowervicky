import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./CountersSection.module.css";

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CountersSection() {
  const [mounted,  setMounted]  = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    setMounted(true);
    const target = new Date(config.event.countdownTarget).getTime();

    function calc() {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const target = config.mockVisitorCount;
    let current  = 0;
    const step   = Math.ceil(target / 55);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setVisitors(current);
      if (current >= target) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const units = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.countdownBlock}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <h2 className={styles.title}>Counting Down to the Big Day</h2>
        <p className={styles.subtitle}>{config.event.date} · {config.event.time}</p>

        <div className={styles.grid}>
          {units.map(({ label, value }) => (
            <div key={label} className={styles.unit}>
              <div className={styles.unitBox}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={value}
                    className={styles.unitNum}
                    initial={{ y: -28, opacity: 0 }}
                    animate={{ y: 0,   opacity: 1 }}
                    exit={{ y: 28,     opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {pad(value)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className={styles.unitLabel}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={styles.visitorPill}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.2 }}
      >
        <span className={styles.visitorIcon}>🎉</span>
        <span className={styles.visitorCount}>{visitors.toLocaleString()}</span>
        <span className={styles.visitorLabel}>friends have visited this page</span>
      </motion.div>
    </section>
  );
}
