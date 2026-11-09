import { contenido, type Idioma } from "./contenido";

export type TextosExperiencia = { periodo: string; rol: string; detalle: string[] };

export type ExperienciaItem = {
  id: string;
  empresa: string;
  logo: string;
  en: TextosExperiencia;
  es: TextosExperiencia;
};

const LOGOS_BASE = ["/subida-1b5814c4.png", "/subida-eda350f3.png", "/subida-fa641c24.png", "/subida-5f3afc56.png"];

export const EXPERIENCIA_BASE: ExperienciaItem[] = contenido.en.experiencia.map((e, i) => {
  const es = contenido.es.experiencia[i];
  return {
    id: `base-${i}`,
    empresa: e.empresa,
    logo: LOGOS_BASE[i] ?? "",
    en: { periodo: e.periodo, rol: e.rol, detalle: e.detalle },
    es: es
      ? { periodo: es.periodo, rol: es.rol, detalle: es.detalle }
      : { periodo: e.periodo, rol: e.rol, detalle: e.detalle },
  };
});

const CLAVE_EXPERIENCIA = "portafolio-experiencia";

export function textosDe(item: ExperienciaItem, idioma: Idioma): TextosExperiencia {
  return item[idioma];
}

export function cargarExperiencia(): ExperienciaItem[] {
  if (typeof window === "undefined") return EXPERIENCIA_BASE;
  try {
    const guardado = window.localStorage.getItem(CLAVE_EXPERIENCIA);
    if (!guardado) return EXPERIENCIA_BASE;
    const datos: unknown = JSON.parse(guardado);
    return Array.isArray(datos) ? (datos as ExperienciaItem[]) : EXPERIENCIA_BASE;
  } catch {
    return EXPERIENCIA_BASE;
  }
}

export function guardarExperiencia(lista: ExperienciaItem[]): boolean {
  try {
    window.localStorage.setItem(CLAVE_EXPERIENCIA, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export type EducacionItem = {
  id: string;
  logo: string;
  archivo: string;
  en: { titulo: string; lugar: string };
  es: { titulo: string; lugar: string };
};

const LOGO_UPN = "/subida-3f987bff.png";
const ARCHIVO_UPN = "/subida-18e99fc3.pdf";

export const EDUCACION_BASE: EducacionItem[] = [
  { id: "edu-base", logo: LOGO_UPN, archivo: ARCHIVO_UPN, en: contenido.en.educacion, es: contenido.es.educacion },
];

const CLAVE_EDUCACION = "portafolio-educacion";

export function cargarEducacion(): EducacionItem[] {
  if (typeof window === "undefined") return EDUCACION_BASE;
  try {
    const guardado = window.localStorage.getItem(CLAVE_EDUCACION);
    if (!guardado) return EDUCACION_BASE;
    const datos: unknown = JSON.parse(guardado);
    if (!Array.isArray(datos)) return EDUCACION_BASE;
    return (datos as Partial<EducacionItem>[]).map((x) => ({
      ...(x as EducacionItem),
      logo: x.logo ?? (x.id === "edu-base" ? LOGO_UPN : ""),
      archivo: x.archivo ?? (x.id === "edu-base" ? ARCHIVO_UPN : ""),
    }));
  } catch {
    return EDUCACION_BASE;
  }
}

export function guardarEducacion(lista: EducacionItem[]): boolean {
  try {
    window.localStorage.setItem(CLAVE_EDUCACION, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export function restablecerEducacion(): void {
  window.localStorage.removeItem(CLAVE_EDUCACION);
}

export function restablecerExperiencia(): void {
  window.localStorage.removeItem(CLAVE_EXPERIENCIA);
}
