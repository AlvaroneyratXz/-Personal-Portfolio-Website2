import { useEffect, useRef } from "react";

type Tema = "gojo" | "itachi" | "yoriichi";

const COLORES: Record<Tema, string> = {
  gojo: "oklch(0.82 0.13 210)",
  itachi: "oklch(0.62 0.23 25)",
  yoriichi: "oklch(0.78 0.16 70)",
};

const SECCION_TEMA: Record<string, Tema> = {
  about: "gojo",
  experience: "itachi",
  skills: "gojo",
  projects: "yoriichi",
  services: "itachi",
  contact: "yoriichi",
};

const SECCIONES = ["about", "experience", "skills", "projects", "services", "contact"];

// Estela y explosión al hacer clic según el personaje de la sección: Gojo (azul), Itachi (rojo), Yoriichi (dorado).
export function EfectosCursor() {
  const tema = useRef<Tema>("gojo");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const en of entradas) {
          if (en.isIntersecting) tema.current = SECCION_TEMA[en.target.id] ?? "gojo";
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const id of SECCIONES) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }

    const crear = (x: number, y: number, dx: number, dy: number, tam: number, dur: number) => {
      const p = document.createElement("span");
      const t = tema.current;
      p.className = `particula-cursor particula-${t}`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.width = `${tam}px`;
      p.style.height = `${tam}px`;
      p.style.background = COLORES[t];
      p.style.boxShadow = `0 0 10px ${COLORES[t]}`;
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--dy", `${dy}px`);
      p.style.animationDuration = `${dur}ms`;
      document.body.appendChild(p);
      window.setTimeout(() => p.remove(), dur + 50);
    };

    let ultimo = 0;
    const alMover = (e: PointerEvent) => {
      const ahora = performance.now();
      if (ahora - ultimo < 45) return;
      ultimo = ahora;
      crear(e.clientX, e.clientY, (Math.random() - 0.5) * 24, -10 - Math.random() * 26, 4 + Math.random() * 4, 700);
    };
    const alClic = (e: PointerEvent) => {
      for (let i = 0; i < 14; i++) {
        const ang = (Math.PI * 2 * i) / 14;
        const dist = 40 + Math.random() * 40;
        crear(e.clientX, e.clientY, Math.cos(ang) * dist, Math.sin(ang) * dist, 5 + Math.random() * 5, 650);
      }
    };

    window.addEventListener("pointermove", alMover, { passive: true });
    window.addEventListener("pointerdown", alClic, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerdown", alClic);
    };
  }, []);

  return null;
}
