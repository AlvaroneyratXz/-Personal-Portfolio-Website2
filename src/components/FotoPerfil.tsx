export function FotoPerfil({ className }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className ?? ""}`}>
      <span className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-ojos via-sharingan to-destello opacity-70 blur-sm" />
      <img
        src="/subida-2c7684ab.png"
        alt="Alvaro Jose Neyra Sáenz"
        className="relative h-28 w-28 rounded-full border-2 border-ojos object-cover md:h-32 md:w-32"
      />
    </div>
  );
}
