import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./IntroVideo.module.css";

export default function IntroVideo() {
  const videoRef              = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [fading,  setFading]  = useState(false);

  function dismiss() {
    if (fading) return;
    setFading(true);
    setTimeout(() => setVisible(false), 700);
  }

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => dismiss());
    vid.addEventListener("ended", dismiss);
    return () => vid.removeEventListener("ended", dismiss);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!fading && (
        <motion.div
          className={styles.overlay}
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src="/intro.mp4"
            muted
            playsInline
            preload="auto"
          />

          <motion.button
            className={styles.skip}
            onClick={dismiss}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Skip intro"
          >
            Skip ›
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
