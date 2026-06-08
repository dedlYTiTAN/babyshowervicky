import { motion } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./DetailsSection.module.css";

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function DetailsSection() {
  const { event, taglines } = config;

  return (
    <section id="details" className={styles.section}>
      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>Event Details</h2>
        <p className={styles.sectionSub}>Everything you need to know</p>
      </motion.div>

      <div className={styles.grid}>
        <motion.div
          className={`${styles.card} ${styles.cardBlue}`}
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(179,217,247,0.4)" }}
        >
          <div className={styles.cardIcon} style={{ color: "var(--blue-deep)" }}>
            <CalendarIcon />
          </div>
          <h3 className={styles.cardLabel}>Date</h3>
          <p className={styles.cardValue}>{event.date}</p>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.cardPink}`}
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.12 }}
          whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(255,194,212,0.4)" }}
        >
          <div className={styles.cardIcon} style={{ color: "var(--pink-deep)" }}>
            <ClockIcon />
          </div>
          <h3 className={styles.cardLabel}>Time</h3>
          <p className={styles.cardValue}>{event.time}</p>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.cardGold} ${styles.cardWide}`}
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.22 }}
          whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(240,201,110,0.38)" }}
        >
          <div className={styles.cardIcon} style={{ color: "var(--gold-deep)" }}>
            <PinIcon />
          </div>
          <h3 className={styles.cardLabel}>Venue</h3>
          <p className={styles.cardValue}>{event.venue.name}</p>
          <p className={styles.cardAddress}>{event.venue.address}</p>
        </motion.div>
      </div>

      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <span className={styles.bannerQuote} aria-hidden>&ldquo;</span>
        <p>{taglines.main}</p>
        <span className={styles.bannerQuote} aria-hidden>&rdquo;</span>
      </motion.div>
    </section>
  );
}
