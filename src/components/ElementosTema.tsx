import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useIdioma } from "../lib/idioma";
import { IMAGENES_TEMA, NOMBRES_TEMA, POSICION_TEMA, type Tema } from "../lib/tema";

const PIEL = "oklch(0.86 0.05 60)";

export function Personaje({ className, tema }: { className?: string; tema: Tema }) {
  const [fallo, setFallo] = useState(false);
  // Si subes /personajes/gojo.png, /personajes/itachi.png o /personajes/yoriichi.png se usan en lugar del dibujo.
  if (!fallo) {
    return (
      <img
        src={IMAGENES_TEMA[tema]}
        alt={NOMBRES_TEMA[tema]}
        style={{ objectPosition: POSICION_TEMA[tema] }}
        className={`${className ?? ""} object-cover`}
        onError={() => setFallo(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {tema === "gojo" && (
        <g>
          <path d="M8 140 Q8 100 60 98 Q112 100 112 140 Z" fill="#1a2036" />
          <path d="M44 98 L60 118 L76 98 Z" fill="#0d1120" />
          <rect x="52" y="82" width="16" height="20" fill={PIEL} />
          <ellipse cx="60" cy="62" rx="26" ry="30" fill={PIEL} />
          <polygon
            points="30,64 24,30 38,36 40,12 52,28 60,6 68,28 80,12 82,36 96,30 90,64 80,42 60,34 40,42"
            fill="#f4f7ff"
            stroke="var(--ojos)"
            strokeWidth="1.5"
          />
          <rect x="33" y="52" width="54" height="14" rx="5" fill="#10131f" />
          <rect x="36" y="57" width="48" height="2" rx="1" fill="var(--ojos)" className="parpadeo-ojo" />
          <path d="M52 84 Q60 88 68 84" stroke="#8a5a4a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {tema === "itachi" && (
        <g>
          <path d="M8 140 Q8 100 60 98 Q112 100 112 140 Z" fill="#14090d" />
          <path d="M34 100 L60 132 L86 100 L98 106 L60 140 L22 106 Z" fill="#a3122a" />
          <circle cx="22" cy="126" r="7" fill="#c0142a" />
          <circle cx="98" cy="126" r="7" fill="#c0142a" />
          <rect x="52" y="82" width="16" height="20" fill={PIEL} />
          <path d="M26 74 Q18 18 60 12 Q102 18 94 74 L90 118 L82 62 Q60 34 38 62 L30 118 Z" fill="#0a0507" />
          <ellipse cx="60" cy="66" rx="24" ry="28" fill={PIEL} />
          <path d="M34 50 Q60 30 86 50 L86 40 Q60 18 34 40 Z" fill="#0a0507" />
          <path d="M44 72 Q48 80 54 84" stroke="#6b3b3b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M76 72 Q72 80 66 84" stroke="#6b3b3b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="48" cy="62" r="5.5" fill="#c0142a" className="parpadeo-ojo" />
          <circle cx="72" cy="62" r="5.5" fill="#c0142a" className="parpadeo-ojo" />
          <circle cx="48" cy="62" r="1.8" fill="#0a0507" />
          <circle cx="72" cy="62" r="1.8" fill="#0a0507" />
        </g>
      )}
      {tema === "yoriichi" && (
        <g>
          <path d="M8 140 Q8 100 60 98 Q112 100 112 140 Z" fill="#3a1a12" />
          <path d="M40 100 L60 124 L80 100 L88 104 L60 140 L32 104 Z" fill="#d9a441" />
          <rect x="52" y="82" width="16" height="20" fill={PIEL} />
          <polygon
            points="28,66 20,34 36,42 34,12 50,30 60,4 70,30 86,12 84,42 100,34 92,66 80,40 60,32 40,40"
            fill="#2b1114"
          />
          <polygon points="34,12 38,26 44,22" fill="#c0392b" />
          <polygon points="86,12 82,26 76,22" fill="#c0392b" />
          <polygon points="60,4 55,20 65,20" fill="#c0392b" />
          <ellipse cx="60" cy="64" rx="25" ry="29" fill={PIEL} />
          <path d="M54 44 Q60 30 66 44 Q63 40 60 50 Q57 40 54 44 Z" fill="#c0392b" />
          <path d="M42 62 L54 62" stroke="#2b1114" strokeWidth="3" strokeLinecap="round" />
          <path d="M66 62 L78 62" stroke="#2b1114" strokeWidth="3" strokeLinecap="round" />
          <rect x="29" y="68" width="6" height="18" rx="2" fill="#d9a441" className="parpadeo-ojo" />
          <rect x="85" y="68" width="6" height="18" rx="2" fill="#d9a441" className="parpadeo-ojo" />
          <path d="M52 84 Q60 87 68 84" stroke="#8a5a4a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function Cuervos() {
  const aves = [
    { top: "12%", retraso: "0s", escala: 1 },
    { top: "38%", retraso: "5s", escala: 0.7 },
    { top: "62%", retraso: "10s", escala: 0.85 },
  ];
  return (
    <>
      {aves.map((a) => (
        <svg
          key={a.top}
          viewBox="0 0 40 20"
          className="cuervo pointer-events-none absolute text-ojos opacity-40"
          style={{ top: a.top, animationDelay: a.retraso, width: `${48 * a.escala}px` }}
          aria-hidden="true"
        >
          <path d="M0 10 Q10 -2 20 10 Q30 -2 40 10 Q30 6 20 16 Q10 6 0 10Z" fill="currentColor" />
        </svg>
      ))}
    </>
  );
}

const MENSAJES: Record<Tema, Record<"en" | "es", Record<string, string>>> = {
  gojo: {
    en: {
      about: "Welcome. Watching the whole network with the Six Eyes.",
      experience: "Four roles, one standard: precision.",
      skills: "Domain expansion: every tool within reach.",
      projects: "Results speak louder than power.",
      contact: "Say the word and the incident is handled.",
    },
    es: {
      about: "Bienvenido. Vigilando toda la red con los Seis Ojos.",
      experience: "Cuatro roles, un estándar: precisión.",
      skills: "Expansión de dominio: cada herramienta a tu alcance.",
      projects: "Los resultados hablan más fuerte que el poder.",
      contact: "Di la palabra y el incidente queda resuelto.",
    },
  },
  itachi: {
    en: {
      about: "Quiet watch. Nothing escapes the crows.",
      experience: "Every role, a lesson in defense.",
      skills: "Skills honed in the shadows.",
      projects: "Threats seen before they strike.",
      contact: "Speak. I'm listening.",
    },
    es: {
      about: "Vigilancia silenciosa. Nada escapa a los cuervos.",
      experience: "Cada rol, una lección de defensa.",
      skills: "Habilidades forjadas en la sombra.",
      projects: "Amenazas vistas antes de que ataquen.",
      contact: "Habla. Te escucho.",
    },
  },
  yoriichi: {
    en: {
      about: "Focus. One breath, one goal.",
      experience: "Years of discipline, one clean path.",
      skills: "Mastery comes from daily practice.",
      projects: "One strike, problem solved.",
      contact: "The sun is up. Let's work together.",
    },
    es: {
      about: "Enfoque. Una respiración, un objetivo.",
      experience: "Años de disciplina, un camino limpio.",
      skills: "La maestría nace de la práctica diaria.",
      projects: "Un corte, problema resuelto.",
      contact: "Sale el sol. Trabajemos juntos.",
    },
  },
};

const PERSONAJE_SECCION: Record<string, Tema> = {
  about: "gojo",
  experience: "itachi",
  skills: "gojo",
  projects: "yoriichi",
  contact: "yoriichi",
};

const SECCIONES = ["about", "experience", "skills", "projects", "contact"];

export function Companero() {
  const { idioma } = useIdioma();
  const [seccion, setSeccion] = useState("about");
  const tema: Tema = PERSONAJE_SECCION[seccion] ?? "gojo";
  const [visible, setVisible] = useState(true);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const en of entradas) {
          if (en.isIntersecting) setSeccion(en.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const id of SECCIONES) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    const alScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", alScroll);
    };
  }, []);

  const texto = MENSAJES[tema][idioma][seccion] ?? "";
  const circ = 2 * Math.PI * 30;

  return (
    <div data-tema={tema} className="fixed bottom-4 right-4 z-40 hidden items-end gap-2 sm:flex">
      {visible && texto && (
        <div className="relative mb-6 hidden max-w-[13rem] rounded-lg border border-ojos/40 bg-card px-3 py-2 text-xs shadow-lg sm:block">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="close"
          >
            <X className="h-3 w-3" />
          </button>
          <span className="mb-0.5 block font-mono text-[10px] uppercase text-destello">{NOMBRES_TEMA[tema]}</span>
          {texto}
        </div>
      )}
      <button
        type="button"
        onClick={() => setVisible(true)}
        title={NOMBRES_TEMA[tema]}
        aria-label={NOMBRES_TEMA[tema]}
        className="flotar relative h-12 w-12 shrink-0 sm:h-16 sm:w-16"
      >
        <svg viewBox="0 0 70 70" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="35" cy="35" r="30" fill="var(--card)" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="35"
            cy="35"
            r="30"
            fill="none"
            stroke="var(--ojos)"
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progreso)}
            strokeLinecap="round"
          />
        </svg>
        <Personaje tema={tema} className="absolute inset-1 h-10 w-10 overflow-hidden rounded-full sm:inset-2 sm:h-12 sm:w-12" />
      </button>
    </div>
  );
}

export function MotivoTema({ className, tema }: { className?: string; tema: Tema }) {

  if (tema === "itachi") {
    const angulos = [90, 210, 330];
    return (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="52" strokeDasharray="4 6" />
        {angulos.map((a) => {
          const x = 100 + 52 * Math.cos((a * Math.PI) / 180);
          const y = 100 - 52 * Math.sin((a * Math.PI) / 180);
          return <circle key={a} cx={x} cy={y} r="10" fill="currentColor" />;
        })}
        <circle cx="100" cy="100" r="14" fill="currentColor" />
      </svg>
    );
  }

  if (tema === "yoriichi") {
    const rayos = Array.from({ length: 16 }, (_, i) => i * 22.5);
    return (
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
        <circle cx="100" cy="100" r="34" fill="currentColor" fillOpacity="0.5" />
        <circle cx="100" cy="100" r="58" strokeDasharray="2 8" />
        {rayos.map((a) => {
          const r1 = 68;
          const r2 = a % 45 === 0 ? 96 : 84;
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={100 + r1 * Math.cos(rad)}
              y1={100 + r1 * Math.sin(rad)}
              x2={100 + r2 * Math.cos(rad)}
              y2={100 + r2 * Math.sin(rad)}
            />
          );
        })}
      </svg>
    );
  }

  const vertices = Array.from({ length: 6 }, (_, i) => {
    const rad = ((i * 60 - 90) * Math.PI) / 180;
    return `${100 + 78 * Math.cos(rad)},${100 + 78 * Math.sin(rad)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="94" />
      <polygon points={vertices} />
      <circle cx="100" cy="100" r="44" strokeDasharray="3 6" />
      <circle cx="100" cy="100" r="22" />
      <circle cx="100" cy="100" r="9" fill="currentColor" />
    </svg>
  );
}
