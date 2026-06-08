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

  // JS cover-sizing: more reliable than pure CSS on iOS Safari.
  // Sets exact px dimensions so video always fills the screen with no bars.
  function sizeVideo() {
    const vid = videoRef.current;
    if (!vid) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const videoAspect = vid.videoWidth && vid.videoHeight
      ? vid.videoWidth / vid.videoHeight
      : 16 / 9;
    const screenAspect = vw / vh;

    let w: number, h: number;
    if (screenAspect > videoAspect) {
      w = vw;
      h = vw / videoAspect;
    } else {
      h = vh;
      w = vh * videoAspect;
    }

    vid.style.width     = `${w}px`;
    vid.style.height    = `${h}px`;
    vid.style.top       = `${(vh - h) / 2}px`;
    vid.style.left      = `${(vw - w) / 2}px`;
    vid.style.transform = "none";
  }

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.addEventListener("loadedmetadata", sizeVideo);
    window.addEventListener("resize", sizeVideo);
    sizeVideo(); // apply immediately (metadata may already be cached)

    vid.muted = true;
    vid.play().catch(() => dismiss());

    vid.addEventListener("ended", dismiss);
    return () => {
      vid.removeEventListener("ended", dismiss);
      vid.removeEventListener("loadedmetadata", sizeVideo);
      window.removeEventListener("resize", sizeVideo);
    };
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
