import { useEffect, useRef } from "react";

interface Props { active: boolean }

const COLORS = ["#b3d9f7", "#ffc2d4", "#f0c96e", "#ffffff", "#c3e6cb", "#fde0e9", "#f0c96e"];

type Piece = {
  x: number; y: number; w: number; h: number;
  color: string; vx: number; vy: number; rot: number; rSpeed: number;
};

export default function Confetti({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: Piece[] = Array.from({ length: 120 }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * -canvas.height * 0.5,
      w:      Math.random() * 9 + 5,
      h:      Math.random() * 5 + 3,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:     (Math.random() - 0.5) * 2.5,
      vy:     Math.random() * 3.5 + 1.5,
      rot:    Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 5,
    }));

    const start    = Date.now();
    const DURATION = 4500;

    function draw() {
      const elapsed = Date.now() - start;
      if (elapsed > DURATION) {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        return;
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      // Fade out in last 40% of animation
      const alpha = Math.max(0, 1 - Math.max(0, elapsed - DURATION * 0.6) / (DURATION * 0.4));

      for (const p of pieces) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.045;
        p.rot += p.rSpeed;
        if (p.y > canvas!.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas!.width;
        }

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rot * Math.PI) / 180);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 200,
        display: active ? "block" : "none",
      }}
    />
  );
}
