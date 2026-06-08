import { motion } from "framer-motion";
import styles from "./GallerySection.module.css";

const PLACEHOLDERS = [
  { bg: "linear-gradient(135deg,#b3d9f7,#d6ecfa)",  label: "📷 Photo 1" },
  { bg: "linear-gradient(135deg,#ffc2d4,#ffe0ea)",  label: "📷 Photo 2" },
  { bg: "linear-gradient(135deg,#f0c96e,#fde9b0)",  label: "📷 Photo 3" },
  { bg: "linear-gradient(135deg,#c3e6cb,#d9f0df)",  label: "📷 Photo 4" },
  { bg: "linear-gradient(135deg,#ffc2d4,#b3d9f7)",  label: "📷 Photo 5" },
  { bg: "linear-gradient(135deg,#f0c96e,#ffc2d4)",  label: "📷 Photo 6" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  show:   { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function GallerySection() {
  return (
    <section id="gallery" className={styles.section}>
      <motion.div
        className={styles.heading}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Memories Gallery</h2>
        <p className={styles.subtitle}>Photos from our journey — more coming soon!</p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {PLACEHOLDERS.map((p, i) => (
          <motion.div
            key={i}
            className={styles.frame}
            style={{ background: p.bg }}
            variants={itemVariants}
            whileHover={{ scale: 1.06, boxShadow: "0 16px 48px rgba(61,43,31,0.18)", zIndex: 2 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <span className={styles.frameLabel}>{p.label}</span>
            <div className={styles.overlay}>
              <span>View</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
