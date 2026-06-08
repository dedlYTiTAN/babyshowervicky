import { motion } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./FooterSection.module.css";

export default function FooterSection() {
  const { parents, footer } = config;

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.wave} aria-hidden>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="var(--beige)" />
        </svg>
      </div>

      <div className={styles.inner}>
        <motion.div
          className={styles.floaters}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          🍼 ⭐ 🎈 💕 ☁️
        </motion.div>

        <p className={styles.mainText}>We can&apos;t wait to celebrate with you.</p>

        <p className={styles.parents}>
          <span className={styles.script}>{parents.partner1}</span>
          <span className={styles.amp}> &amp; </span>
          <span className={styles.script}>{parents.partner2}</span>
        </p>

        <div className={styles.divider} aria-hidden>
          <span className={styles.dividerLine} />
          <span>💝</span>
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.credit}>{footer.credit}</p>
      </div>
    </motion.footer>
  );
}
