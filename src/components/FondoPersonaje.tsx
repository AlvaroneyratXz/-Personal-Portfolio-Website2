import { Personaje } from "./ElementosTema";
import { TEMAS, type Tema } from "../lib/tema";

export function FondoPersonaje({ tema, lado }: { tema: Tema; lado: "left" | "right" }) {
  const mascara = `linear-gradient(to ${lado === "right" ? "left" : "right"}, black 20%, transparent)`;
  return (
    <div
      data-tema={tema}
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 hidden h-[28rem] w-80 -translate-y-1/2 lg:block ${
        lado === "right" ? "-right-10" : "-left-10"
      }`}
    >
      <div className="h-full w-full" style={{ maskImage: mascara, WebkitMaskImage: mascara }}>
        <Personaje tema={tema} className="flotar-lento h-full w-full opacity-[0.18]" />
      </div>
    </div>
  );
}

export function TrioHero({ className }: { className?: string }) {
  return (
    <div className={`flex -space-x-5 ${className ?? ""}`}>
      {TEMAS.map((t, i) => (
        <div key={t} data-tema={t} className="flotar" style={{ animationDelay: `${i * 0.7}s` }}>
          <Personaje
            tema={t}
            className="h-16 w-16 rounded-full border-2 border-ojos object-cover shadow-[0_0_18px_-4px] shadow-ojos/70"
          />
        </div>
      ))}
    </div>
  );
}
