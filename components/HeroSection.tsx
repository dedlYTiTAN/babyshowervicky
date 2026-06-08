import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { config } from "../config/babyShowerConfig";
import styles from "./HeroSection.module.css";

// ── Floating decorative elements ──────────────────────────────────────────────
// Each has its own float path (y + slight x drift) and optional spin
const FLOATERS = [
  { emoji: "🎈", size: 48, top: "10%", left: "6%",   delay: 0,    dur: 4.5, xDrift: 6  },
  { emoji: "🎈", size: 38, top: "22%", left: "87%",  delay: 0.9,  dur: 5.4, xDrift: -5 },
  { emoji: "🎈", size: 56, top: "60%", left: "4%",   delay: 1.6,  dur: 4.2, xDrift: 4  },
  { emoji: "🎀", size: 36, top: "74%", left: "90%",  delay: 0.4,  dur: 5.9, xDrift: -6 },
  { emoji: "☁️",  size: 58, top: "7%",  left: "56%",  delay: 1.3,  dur: 7.0, xDrift: 10 },
  { emoji: "☁️",  size: 40, top: "46%", left: "92%",  delay: 2.1,  dur: 6.2, xDrift: -8 },
  { emoji: "☁️",  size: 34, top: "32%", left: "1%",   delay: 3.0,  dur: 6.8, xDrift: 7  },
  { emoji: "⭐",  size: 30, top: "16%", left: "27%",  delay: 0.7,  dur: 3.9, xDrift: 3  },
  { emoji: "⭐",  size: 24, top: "80%", left: "70%",  delay: 1.9,  dur: 4.4, xDrift: -4 },
  { emoji: "⭐",  size: 20, top: "50%", left: "45%",  delay: 2.8,  dur: 5.1, xDrift: 5  },
  { emoji: "🌸",  size: 32, top: "36%", left: "2%",   delay: 2.3,  dur: 5.2, xDrift: 6  },
  { emoji: "🌸",  size: 26, top: "88%", left: "40%",  delay: 3.5,  dur: 4.8, xDrift: -3 },
  { emoji: "💫",  size: 28, top: "54%", left: "95%",  delay: 0.3,  dur: 4.9, xDrift: -6 },
  { emoji: "💕",  size: 30, top: "14%", left: "73%",  delay: 2.6,  dur: 4.6, xDrift: 5  },
  { emoji: "🍼",  size: 34, top: "76%", left: "16%",  delay: 1.1,  dur: 5.5, xDrift: -4 },
  { emoji: "💛",  size: 22, top: "92%", left: "82%",  delay: 4.0,  dur: 5.8, xDrift: 3  },
];

// Spinning sparkle stars – purely decorative CSS circles
const SPARKS = [
  { size: 6,  top: "30%", left: "15%", delay: 0    },
  { size: 8,  top: "65%", left: "78%", delay: 0.8  },
  { size: 5,  top: "20%", left: "50%", delay: 1.5  },
  { size: 7,  top: "85%", left: "32%", delay: 2.2  },
  { size: 4,  top: "42%", left: "60%", delay: 0.4  },
  { size: 9,  top: "72%", left: "55%", delay: 3.0  },
  { size: 5,  top: "8%",  left: "38%", delay: 1.8  },
  { size: 6,  top: "95%", left: "65%", delay: 0.6  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const textVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)" },
};

export default function HeroSection() {
  const { parents, event, taglines } = config;
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background drifts upward slower than scroll
  const { scrollY } = useScroll();
  const rawBgY = useTransform(scrollY, [0, 600], [0, 120]);
  const bgY    = useSpring(rawBgY, { stiffness: 60, damping: 20 });

  return (
    <section id="hero" ref={sectionRef} className={styles.hero}>

      {/* ── Animated gradient background layer ─────────────────────────── */}
      <motion.div className={styles.bgLayer} style={{ y: bgY }} aria-hidden />

      {/* ── Radial glow orbs ──────────────────────────────────────────── */}
      <motion.div
        className={`${styles.orb} ${styles.orbBlue}`}
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className={`${styles.orb} ${styles.orbPink}`}
        animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      />
      <motion.div
        className={`${styles.orb} ${styles.orbGold}`}
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden
      />

      {/* ── Twinkling spark dots ───────────────────────────────────────── */}
      {SPARKS.map((s, i) => (
        <motion.span
          key={`spark-${i}`}
          className={styles.spark}
          style={{ width: s.size, height: s.size, top: s.top, left: s.left }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          aria-hidden
        />
      ))}

      {/* ── Floating emoji decorations ─────────────────────────────────── */}
      {FLOATERS.map((f, i) => (
        <motion.div
          key={`float-${i}`}
          className={styles.floater}
          style={{ top: f.top, left: f.left, fontSize: f.size }}
          // Each floater has a unique y + subtle x oscillation
          animate={{
            y:    [0, -20, 0],
            x:    [0, f.xDrift, 0],
            rotate: f.emoji === "⭐" || f.emoji === "💫"
              ? [0, 15, -15, 0]   // stars spin a little
              : [0, 0, 0],
          }}
          transition={{
            delay:    f.delay,
            duration: f.dur,
            repeat:   Infinity,
            ease:     "easeInOut",
          }}
          aria-hidden
        >
          {f.emoji}
        </motion.div>
      ))}

      {/* ── Main content ──────────────────────────────────────────────── */}
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Animated badge – pulses gently after entering */}
        <motion.div
          className={styles.badge}
          variants={textVariants}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.5 }}
            style={{ display: "inline-block" }}
          >
            ✨
          </motion.span>
          {" "}You&apos;re Invited{" "}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.8 }}
            style={{ display: "inline-block" }}
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Title – letters blur-in staggered via individual spans */}
        <motion.h1
          className={styles.title}
          variants={textVariants}
          transition={{ duration: 0.9 }}
        >
          Baby Shower
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          variants={textVariants}
          transition={{ duration: 0.7 }}
        >
          {taglines.hero}
        </motion.p>

        {/* Animated divider – lines grow outward */}
        <motion.div
          className={styles.divider}
          variants={textVariants}
          transition={{ duration: 0.5 }}
          aria-hidden
        >
          <motion.span
            className={styles.dividerLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
            style={{ originX: 1 }}
          />
          <motion.span
            className={styles.dividerIcon}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            🍼
          </motion.span>
          <motion.span
            className={styles.dividerLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
            style={{ originX: 0 }}
          />
        </motion.div>

        {/* Parents names – each name pops in */}
        <motion.h2
          className={styles.parents}
          variants={textVariants}
          transition={{ duration: 0.9 }}
        >
          <motion.span
            className={styles.parentName}
            whileHover={{ scale: 1.07, color: "var(--gold-deep)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {parents.partner1}
          </motion.span>
          <span className={styles.parentsAmp}> &amp; </span>
          <motion.span
            className={styles.parentName}
            whileHover={{ scale: 1.07, color: "var(--pink-deep)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {parents.partner2}
          </motion.span>
        </motion.h2>

        {/* Info chips – each slides in from bottom */}
        <motion.div className={styles.chips} variants={textVariants} transition={{ duration: 0.7 }}>
          {[
            { icon: "📅", text: event.date },
            { icon: "⏰", text: event.time },
            { icon: "📍", text: event.venue.name },
          ].map(({ icon, text }, i) => (
            <motion.span
              key={i}
              className={styles.chip}
              whileHover={{ scale: 1.06, y: -4, boxShadow: "0 8px 24px rgba(61,43,31,0.12)" }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              {icon} {text}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          className={styles.tagline}
          variants={textVariants}
          transition={{ duration: 0.7 }}
        >
          {taglines.main}
        </motion.p>

        {/* CTA row */}
        <motion.div
          className={styles.ctaRow}
          variants={textVariants}
          transition={{ duration: 0.6 }}
        >
          {/* Primary CTA */}
          <motion.a
            href="#details"
            className={styles.cta}
            whileHover={{ scale: 1.07, boxShadow: "0 12px 40px rgba(240,201,110,0.55)" }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.span
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
              style={{ display: "inline-block" }}
            >
              💾
            </motion.span>
            {" "}Save the Date
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#reveal"
            className={styles.ctaSecondary}
            whileHover={{ scale: 1.07, boxShadow: "0 12px 36px rgba(255,194,212,0.45)" }}
            whileTap={{ scale: 0.96 }}
          >
            🎊 See the Reveal
          </motion.a>
        </motion.div>

        {/* Animated scroll hint */}
        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ duration: 2, delay: 3, repeat: Infinity }}
        >
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom wave */}
      <div className={styles.wave} aria-hidden>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  );
}
