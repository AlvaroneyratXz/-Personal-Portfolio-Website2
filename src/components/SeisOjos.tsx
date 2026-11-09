const ESTILOS = `
@keyframes seis-ojos-orbita { to { transform: rotate(360deg); } }
@keyframes seis-ojos-latido { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes seis-ojos-aura { 0%, 100% { transform: scale(.9); opacity: .35; } 50% { transform: scale(1.15); opacity: .7; } }
@media (prefers-reduced-motion: no-preference) {
  .seis-ojos-anillo { animation: seis-ojos-orbita 40s linear infinite; transform-origin: 50% 50%; }
  .seis-ojos-iris { animation: seis-ojos-latido 2.6s ease-in-out infinite; }
  .seis-ojos-aura { animation: seis-ojos-aura 4s ease-in-out infinite; transform-origin: 50% 50%; }
}
`;

export function SeisOjos({ className }: { className?: string }) {
  const ojos = Array.from({ length: 6 }, (_, i) => {
    const grados = i * 60 - 90;
    const rad = (grados * Math.PI) / 180;
    return { i, x: 100 + 68 * Math.cos(rad), y: 100 + 68 * Math.sin(rad), giro: grados + 90 };
  });
  return (
    <div data-tema="gojo" className={className} aria-hidden="true">
      <style>{ESTILOS}</style>
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <circle cx="100" cy="100" r="90" fill="var(--ojos)" opacity="0.12" className="seis-ojos-aura" />
        <g className="seis-ojos-anillo">
          <circle cx="100" cy="100" r="68" fill="none" stroke="var(--ojos)" strokeOpacity="0.3" strokeDasharray="3 6" />
          {ojos.map((o) => (
            <g key={o.i} transform={`translate(${o.x} ${o.y}) rotate(${o.giro})`}>
              <path d="M-17 0 Q0 -13 17 0 Q0 13 -17 0Z" fill="#0b1020" stroke="var(--ojos)" strokeWidth="1.5" />
              <circle r="6.5" fill="var(--ojos)" className="seis-ojos-iris" style={{ animationDelay: `${o.i * 0.4}s` }} />
              <circle r="2.4" fill="#0b1020" />
              <circle cx="-2" cy="-2" r="1.2" fill="#fff" />
            </g>
          ))}
        </g>
        <circle cx="100" cy="100" r="7" fill="var(--ojos)" />
        <circle cx="100" cy="100" r="16" fill="none" stroke="var(--ojos)" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}
