import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { label: "Home",    href: "#hero" },
  { label: "Details", href: "#details" },
  { label: "Reveal",  href: "#reveal" },
  { label: "Games",   href: "#games" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className={styles.logo}>
        <span aria-hidden>🍼</span>
        <span>Baby Shower</span>
      </div>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, href }) => {
          const id = href.slice(1);
          return (
            <li key={href}>
              <a
                href={href}
                className={`${styles.link} ${active === id ? styles.activeLink : ""}`}
              >
                {label}
                {active === id && (
                  <motion.span
                    className={styles.linkDot}
                    layoutId="navDot"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`${styles.mobileLink} ${active === href.slice(1) ? styles.activeMobileLink : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
