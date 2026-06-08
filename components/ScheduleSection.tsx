import { motion } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./ScheduleSection.module.css";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function ScheduleSection() {
  const { schedule, event } = config;

  return (
    <section id="schedule" className={styles.section}>
      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Day&apos;s Schedule</h2>
        <p className={styles.subtitle}>{event.date} · {event.time}</p>
      </motion.div>

      <motion.ol
        className={styles.timeline}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {schedule.map((item, i) => (
          <motion.li
            key={i}
            className={styles.item}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className={styles.connector}>
              <div className={styles.dot} />
              {i < schedule.length - 1 && <div className={styles.line} />}
            </div>

            <div className={styles.card}>
              <span className={styles.icon} aria-hidden>{item.icon}</span>
              <div className={styles.cardBody}>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.activity}>{item.activity}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
