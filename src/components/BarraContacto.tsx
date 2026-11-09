import { Mail, Phone } from "lucide-react";
import { useIdioma } from "../lib/idioma";

export const TELEFONO_VISIBLE = "+51 912 921 771";
export const TELEFONO_ENLACE = "+51912921771";
export const CORREO_CONTACTO = "neyra11423@hotmail.com";

export function BarraContacto() {
  const { t } = useIdioma();
  return (
    <div className="border-b border-ojos/20 bg-secondary/80 text-xs">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 sm:justify-end">
        <a
          href={`tel:${TELEFONO_ENLACE}`}
          className="inline-flex items-center gap-1.5 font-mono text-foreground transition hover:text-ojos"
        >
          <Phone className="h-3.5 w-3.5 text-destello" />
          <span className="hidden text-muted-foreground sm:inline">{t.llamame}:</span>
          {TELEFONO_VISIBLE}
        </a>
        <a
          href={`mailto:${CORREO_CONTACTO}`}
          className="inline-flex items-center gap-1.5 font-mono text-foreground transition hover:text-ojos"
        >
          <Mail className="h-3.5 w-3.5 text-destello" />
          <span className="hidden text-muted-foreground sm:inline">{t.escribeme}:</span>
          {CORREO_CONTACTO}
        </a>
      </div>
    </div>
  );
}
