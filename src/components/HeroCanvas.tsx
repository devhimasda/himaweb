"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
  driftPhaseX: number;  // unique phase for ambient X drift
  driftPhaseY: number;  // unique phase for ambient Y drift
  driftFreqX: number;   // unique frequency for X (slow variation)
  driftFreqY: number;   // unique frequency for Y
  colorIndex: number;
}

// Arctic & Warm Sand palette
const COLORS = [
  { r: 82,  g: 160, b: 216 }, // arctic blue
  { r: 100, g: 200, b: 180 }, // teal
  { r: 200, g: 175, b: 120 }, // warm sand
  { r: 130, g: 170, b: 210 }, // sky
  { r: 160, g: 220, b: 200 }, // mint
  { r: 110, g: 185, b: 230 }, // light arctic
];

const PARTICLE_COUNT = 90;
const CONNECTION_DISTANCE = 180;
const MOUSE_INFLUENCE = 140;
const MOUSE_REPEL_FORCE = 0.45;

// Ambient drift strength — this keeps particles moving without cursor
const DRIFT_STRENGTH = 0.012;
// Max speed cap
const MAX_SPEED = 1.4;
// Friction — slightly less than before so drift force can sustain motion
const FRICTION = 0.985;

export default function HeroCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
    };

    const initParticles = () => {
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Give every particle a gentle non-zero starting velocity
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.2 + 1.4,
        alpha: Math.random() * 0.45 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        // Each particle has its own drift rhythm — avoids synchronised motion
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftFreqX: 0.18 + Math.random() * 0.22,  // ~0.18–0.40
        driftFreqY: 0.14 + Math.random() * 0.20,  // ~0.14–0.34
        colorIndex: Math.floor(Math.random() * COLORS.length),
      }));
    };

    resize();
    initParticles();

    // Track mouse on the hero section
    const section = wrapper.parentElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    (section || wrapper).addEventListener("mousemove", onMouseMove as EventListener);
    (section || wrapper).addEventListener("mouseleave", onMouseLeave);

    const handleResize = () => { resize(); initParticles(); };
    window.addEventListener("resize", handleResize);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      const ps = particles.current;
      const W = canvas.width;
      const H = canvas.height;

      // ─── Update particles ───
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // ── 1. Ambient drift force (always active) ──
        // Each particle is steered by two independent sine waves.
        // The result is organic, non-repeating figure-eight-like paths.
        const driftX = Math.sin(t * p.driftFreqX + p.driftPhaseX) * DRIFT_STRENGTH;
        const driftY = Math.cos(t * p.driftFreqY + p.driftPhaseY) * DRIFT_STRENGTH;

        // ── 2. Slow global flow field (canvas-wide current) ──
        // Creates a gentle large-scale swirling effect across the field.
        const nx = p.x / W;  // normalised position 0–1
        const ny = p.y / H;
        const fieldX = Math.sin(t * 0.3 + ny * 2.5) * 0.006;
        const fieldY = Math.cos(t * 0.25 + nx * 2.0) * 0.006;

        p.vx += driftX + fieldX;
        p.vy += driftY + fieldY;

        // ── 3. Mouse repulsion (only when cursor is on hero) ──
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE && dist > 0) {
          const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
          p.vx += (dx / dist) * force * MOUSE_REPEL_FORCE;
          p.vy += (dy / dist) * force * MOUSE_REPEL_FORCE;
        }

        // ── 4. Friction + speed cap ──
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        // ── 5. Move + wrap edges ──
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        // ── 6. Draw dot + dual-layer glow ──
        const pulse = Math.sin(t * 1.8 + p.pulsePhase) * 0.14;
        const alpha = Math.min(1, Math.max(0.05, p.alpha + pulse));
        const c = COLORS[p.colorIndex];

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.fill();

        // Inner glow (tight)
        const grdInner = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        grdInner.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.4})`);
        grdInner.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grdInner;
        ctx.fill();

        // Outer shimmer (wider, breathing at a different frequency)
        const shimmer = Math.sin(t * 0.9 + p.pulsePhase + Math.PI) * 0.08;
        const outerAlpha = Math.max(0, alpha * 0.18 + shimmer);
        const grdOuter = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 10);
        grdOuter.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${outerAlpha})`);
        grdOuter.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 10, 0, Math.PI * 2);
        ctx.fillStyle = grdOuter;
        ctx.fill();
      }

      // ─── Draw constellation lines ───
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);

          if (d < CONNECTION_DISTANCE) {
            const proximity = 1 - d / CONNECTION_DISTANCE;
            const lineAlpha = proximity * proximity * 0.32; // quadratic falloff
            const ca = COLORS[a.colorIndex];
            const cb = COLORS[b.colorIndex];

            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(${ca.r},${ca.g},${ca.b},${lineAlpha})`);
            grad.addColorStop(1, `rgba(${cb.r},${cb.g},${cb.b},${lineAlpha})`);

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = proximity * 1.4;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      (section || wrapper).removeEventListener("mousemove", onMouseMove as EventListener);
      (section || wrapper).removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
