import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import Confetti from "./Confetti";
import styles from "./GenderRevealSection.module.css";

export default function GenderRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 4500);
    return () => clearTimeout(t);
  }, [isInView]);

  return (
    <section id="reveal" ref={sectionRef} className={styles.section}>
      <Confetti active={confetti} />

      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className={styles.title}>Gender Reveal</h2>
        <p className={styles.subtitle}>{config.taglines.genderReveal}</p>
      </motion.div>

      <div className={styles.split}>
        {/* Team Boy */}
        <motion.div
          className={`${styles.team} ${styles.teamBoy}`}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          whileHover={{ scale: 1.03, boxShadow: "0 20px 60px rgba(107,172,224,0.35)" }}
        >
          <motion.span
            className={styles.teamEmoji}
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💙
          </motion.span>
          <h3 className={styles.teamTitle}>Team Boy</h3>
          <p className={styles.teamDesc}>Blue skies ahead~</p>
          <div className={styles.decorations}>
            {["⚽","🚀","🌊","✨"].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ delay: i * 0.28, duration: 2.5, repeat: Infinity }}
              >{e}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* Centerpiece gift box */}
        <motion.div
          className={styles.centerpiece}
          animate={{ scale: [1, 1.08, 1], y: [0, -8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 28px rgba(240,201,110,0.75))" }}
        >
          🎁
        </motion.div>

        {/* Team Girl */}
        <motion.div
          className={`${styles.team} ${styles.teamGirl}`}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          whileHover={{ scale: 1.03, boxShadow: "0 20px 60px rgba(240,127,160,0.35)" }}
        >
          <motion.span
            className={styles.teamEmoji}
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            💗
          </motion.span>
          <h3 className={styles.teamTitle}>Team Girl</h3>
          <p className={styles.teamDesc}>Pink paradise awaits~</p>
          <div className={styles.decorations}>
            {["🌸","🦋","🌷","💫"].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ delay: i * 0.28 + 0.14, duration: 2.5, repeat: Infinity }}
              >{e}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        className={styles.hint}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Join us on {config.event.date} to find out! 🎊
      </motion.p>
    </section>
  );
}
