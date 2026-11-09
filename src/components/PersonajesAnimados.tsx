import { useEffect, useRef, useState } from "react";
import { useIdioma } from "../lib/idioma";
import { NOMBRES_TEMA, TEMAS, type Tema } from "../lib/tema";
import { Personaje } from "./ElementosTema";
import { SeisOjos } from "./SeisOjos";

const ESTILOS_REACCION = `
@keyframes personaje-salto { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(-14px) scale(1.06); } 60% { transform: translateY(0) scale(.98); } 100% { transform: translateY(0) scale(1); } }
@keyframes personaje-onda { 0% { transform: scale(.2); opacity: .8; } 100% { transform: scale(2.4); opacity: 0; } }
@keyframes personaje-flota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: no-preference) {
  .personaje-reacciona { animation: personaje-salto .7s ease-out; }
  .personaje-onda { animation: personaje-onda .8s ease-out forwards; }
  .personaje-flota { animation: personaje-flota 5s ease-in-out infinite; }
}
`;

const GUIAS: Record<Tema, { rol: Record<"en" | "es", string>; desc: Record<"en" | "es", string> }> = {
  gojo: {
    rol: { en: "Monitoring & Networks", es: "Monitoreo y Redes" },
    desc: { en: "Total visibility over the infrastructure.", es: "Visibilidad total sobre la infraestructura." },
  },
  itachi: {
    rol: { en: "Threat Detection", es: "Detección de Amenazas" },
    desc: { en: "Spotting risks before they strike.", es: "Detectar riesgos antes de que ataquen." },
  },
  yoriichi: {
    rol: { en: "Incident Resolution", es: "Resolución de Incidentes" },
    desc: { en: "One precise strike to restore service.", es: "Un golpe preciso para restablecer el servicio." },
  },
};

function Tarjeta({ t, indice }: { t: Tema; indice: number }) {
  const { idioma } = useIdioma();
  const envoltura = useRef<HTMLDivElement | null>(null);
  const boton = useRef<HTMLButtonElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reaccion, setReaccion] = useState(0);
  const [desplazo, setDesplazo] = useState(0);

  useEffect(() => {
    const alScroll = () => {
      const el = envoltura.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - window.innerHeight / 2;
      setDesplazo(Math.max(-14, Math.min(14, centro * -0.04)));
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    if (reaccion === 0) return;
    const id = window.setTimeout(() => setReaccion(0), 800);
    return () => window.clearTimeout(id);
  }, [reaccion]);

  useEffect(() => {
    const el = envoltura.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const en of entradas) {
          if (en.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const mover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = boton.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  };
  const soltar = () => {
    const el = boton.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={envoltura}
      data-tema={t}
      className={`revelar ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${indice * 150}ms` }}
    >
      <button
        ref={boton}
        type="button"
        onMouseMove={mover}
        onMouseLeave={soltar}
        onClick={() => setReaccion((n) => n + 1)}
        className={`group relative block w-full overflow-hidden rounded-xl border bg-card text-left transition-[transform,box-shadow] duration-200 ${
          "border-ojos/50 shadow-[0_0_30px_-10px] shadow-ojos/60"
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4]">
          <div key={reaccion} className={`h-full w-full ${reaccion > 0 ? "personaje-reacciona" : "personaje-flota"}`}>
            <div className="h-full w-full" style={{ transform: `translateY(${desplazo}px) scale(1.12)` }}>
              <Personaje tema={t} className="zoom-lento h-full w-full" />
            </div>
          </div>
          {reaccion > 0 && (
            <span className="personaje-onda pointer-events-none absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ojos" />
          )}
          {t === "gojo" && <SeisOjos className="pointer-events-none absolute left-1/2 top-4 h-28 w-28 -translate-x-1/2" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-ojos/0 mix-blend-screen transition group-hover:bg-ojos/10" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="brasa" style={{ left: `${8 + i * 16}%`, animationDelay: `${i * 0.9}s` }} />
          ))}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-xl font-extrabold text-ojos">{NOMBRES_TEMA[t]}</h3>
            <p className="font-mono text-xs text-destello">{GUIAS[t].rol[idioma]}</p>
            <p className="mt-1 text-sm text-foreground/90">{GUIAS[t].desc[idioma]}</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function PersonajesAnimados() {
  const { idioma } = useIdioma();
  return (
    <section className="border-t border-border py-16">
      <style>{ESTILOS_REACCION}</style>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 flex items-center gap-3 text-2xl font-bold md:text-3xl">
          <span className="h-6 w-1 rounded bg-sharingan" />
          {idioma === "es" ? "Mis tres guías" : "My three guides"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMAS.map((t, i) => (
            <Tarjeta key={t} t={t} indice={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
