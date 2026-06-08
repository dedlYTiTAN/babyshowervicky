import { motion } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./MessagesSection.module.css";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0 },
};

export default function MessagesSection() {
  return (
    <section id="messages" className={styles.section}>
      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Wishes &amp; Love Notes</h2>
        <p className={styles.subtitle}>Kind words from family &amp; friends</p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {config.guestMessages.map((msg, i) => (
          <motion.article
            key={i}
            className={styles.card}
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 48px rgba(61,43,31,0.14)" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className={styles.avatar} aria-hidden>{msg.avatar}</div>
            <div className={styles.body}>
              <p className={styles.message}>&ldquo;{msg.message}&rdquo;</p>
              <span className={styles.name}>— {msg.name}</span>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.div
        className={styles.comingSoon}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className={styles.comingSoonTitle}>💌 Leave Your Wishes</h3>
        <p className={styles.comingSoonDesc}>
          Coming soon — drop a heartfelt note for the parents-to-be!
        </p>
        <div className={styles.fakeForm}>
          <input
            className={styles.fakeInput}
            placeholder="Your name…"
            disabled
            aria-label="Name (coming soon)"
          />
          <textarea
            className={styles.fakeTextarea}
            placeholder="Your wish for baby…"
            rows={3}
            disabled
            aria-label="Message (coming soon)"
          />
          <motion.button
            className={styles.fakeBtn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled
          >
            Coming soon: leave your wishes here! 💝
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
