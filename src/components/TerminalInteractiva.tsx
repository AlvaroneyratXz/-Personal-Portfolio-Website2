import { useEffect, useRef, useState } from "react";
import { useIdioma } from "../lib/idioma";

const ARRANQUE = [
  "[Status: Online / Ready for Ops]",
  "ping infrastructure... OK",
  "scanning endpoints... 0 threats",
  "siem.alienvault --sync... OK",
  "type 'help' to explore",
];

function responder(cmd: string, es: boolean): string[] {
  switch (cmd) {
    case "help":
      return ["whoami · skills · contact · status · clear", "???: gojo · itachi · yoriichi"];
    case "whoami":
      return [es ? "Alvaro Neyra — Soporte TI y Ciberseguridad" : "Alvaro Neyra — IT Support & Cybersecurity"];
    case "skills":
      return ["ITIL · M365 · ServiceNow · PowerShell · SIEM · ISO 27001 · NIST CSF"];
    case "contact":
      return ["neyra11423@hotmail.com", "linkedin.com/in/alvaroneyra"];
    case "status":
      return ["[Status: Online / Ready for Ops]", "SLA: 100% · uptime: stable"];
    case "gojo":
      return [es ? "Dominio expandido: Vacío Infinito. Todo bajo monitoreo." : "Domain Expansion: Infinite Void. Everything monitored."];
    case "itachi":
      return [es ? "Genjutsu activado: cada log cuenta una historia." : "Genjutsu active: every log tells a story."];
    case "yoriichi":
      return [es ? "Respiración del Sol: incidente resuelto de un solo corte." : "Sun Breathing: incident resolved in a single strike."];
    default:
      return [es ? `comando no encontrado: ${cmd}` : `command not found: ${cmd}`];
  }
}

export function TerminalInteractiva() {
  const { idioma } = useIdioma();
  const [lineas, setLineas] = useState<string[]>([]);
  const [entrada, setEntrada] = useState("");
  const consolaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      const linea = ARRANQUE[i];
      i += 1;
      if (linea !== undefined) setLineas((prev) => [...prev, linea]);
      if (i >= ARRANQUE.length) window.clearInterval(id);
    }, 650);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const consola = consolaRef.current;
    if (consola) consola.scrollTop = consola.scrollHeight;
  }, [lineas]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = entrada.trim().toLowerCase();
    if (!cmd) return;
    setEntrada("");
    if (cmd === "clear") {
      setLineas([]);
      return;
    }
    setLineas((prev) => [...prev, `$ ${cmd}`, ...responder(cmd, idioma === "es")]);
  };

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-ojos/30 bg-card shadow-[0_0_40px_-12px] shadow-ojos/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-sharingan" />
        <span className="h-3 w-3 rounded-full bg-destello" />
        <span className="h-3 w-3 rounded-full bg-ojos" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">an@ops:~</span>
      </div>
      <div ref={consolaRef} className="h-52 min-w-0 overflow-y-auto p-3 font-mono text-xs sm:h-64 sm:p-4 sm:text-sm">
        {lineas.map((l, idx) => (
          <div key={idx} className={`break-words ${l.startsWith("$") ? "text-destello" : "text-ojos"}`}>
            {l}
          </div>
        ))}
        <form onSubmit={enviar} className="mt-1 flex items-center gap-2">
          <span className="text-sharingan">$</span>
          <input
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            aria-label="terminal"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-mono text-foreground outline-none"
          />
        </form>
      </div>
    </div>
  );
}
