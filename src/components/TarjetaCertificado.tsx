import { Award, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type Props = {
  nombre: string;
  imagen?: string | undefined;
  logo?: string | undefined;
  emisor?: string;
  vigencia?: string | undefined;
};

const esPdf = (ruta: string): boolean =>
  ruta.startsWith("data:application/pdf") || ruta.toLowerCase().endsWith(".pdf");

export function TarjetaCertificado({ nombre, imagen, logo, emisor = "Kaseya University", vigencia }: Props) {
  const contenido = (
    <>
      {logo ? (
        <img
          src={logo}
          alt={emisor}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
        />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
          <Award className="h-6 w-6 text-destello" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug [overflow-wrap:anywhere]">{nombre}</span>
        <span className="mt-1 block font-mono text-xs text-muted-foreground">
          {emisor}
          {vigencia ? ` · ${vigencia}` : ""}
        </span>
      </span>
    </>
  );

  if (!imagen) {
    return (
      <div className="flex w-full items-center gap-4 rounded-xl border border-ojos/40 bg-card p-4 text-left text-sm">
        {contenido}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-4 rounded-xl border border-ojos/40 bg-card p-4 text-left text-sm transition hover:-translate-y-0.5 hover:border-ojos hover:shadow-[0_0_30px_-10px] hover:shadow-ojos/50"
        >
          {contenido}
          <ExternalLink
            className="h-4 w-4 shrink-0 text-ojos transition group-hover:scale-110"
            aria-hidden="true"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{nombre}</DialogTitle>
        </DialogHeader>
        {esPdf(imagen) ? (
          <iframe src={imagen} title={nombre} className="h-[70dvh] w-full rounded-md border border-border" />
        ) : (
          <img
            src={imagen}
            alt={nombre}
            decoding="async"
            className="h-auto w-full rounded-md border border-border shadow-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
