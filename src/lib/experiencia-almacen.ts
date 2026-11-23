/* eslint-disable prettier/prettier */
import { supabase } from "@/integrations/supabase/client";
import {
  contenido,
  type Idioma,
  type RolExperiencia,
  type TipoEmpleo,
  type TipoUbicacion,
} from "./contenido";

export type { RolExperiencia, TipoEmpleo, TipoUbicacion };

export const MESES_OPCIONES: { value: string; en: string; es: string }[] = [
  { value: "", en: "Month", es: "Mes" },
  { value: "01", en: "January", es: "Enero" },
  { value: "02", en: "February", es: "Febrero" },
  { value: "03", en: "March", es: "Marzo" },
  { value: "04", en: "April", es: "Abril" },
  { value: "05", en: "May", es: "Mayo" },
  { value: "06", en: "June", es: "Junio" },
  { value: "07", en: "July", es: "Julio" },
  { value: "08", en: "August", es: "Agosto" },
  { value: "09", en: "September", es: "Septiembre" },
  { value: "10", en: "October", es: "Octubre" },
  { value: "11", en: "November", es: "Noviembre" },
  { value: "12", en: "December", es: "Diciembre" },
];

export const ANIOS_OPCIONES: string[] = Array.from({ length: 30 }, (_, i) => String(2028 - i));

export const MODALIDAD_OPCIONES: { value: TipoUbicacion; en: string; es: string }[] = [
  { value: "", en: "Please select", es: "Selecciona una opción" },
  { value: "on-site", en: "On-site", es: "Presencial" },
  { value: "hybrid", en: "Hybrid", es: "Híbrido" },
  { value: "remote", en: "Remote", es: "Remoto" },
];

export const TIPO_EMPLEO_OPCIONES: { value: TipoEmpleo; en: string; es: string }[] = [
  { value: "", en: "Please select", es: "Selecciona una opción" },
  { value: "full-time", en: "Full-time", es: "Jornada completa" },
  { value: "part-time", en: "Part-time", es: "Jornada parcial" },
  { value: "self-employed", en: "Self-employed", es: "Autónomo" },
  { value: "freelance", en: "Freelance", es: "Freelance" },
  { value: "contract", en: "Contract", es: "Contrato" },
  { value: "internship", en: "Internship", es: "Prácticas" },
  { value: "apprenticeship", en: "Apprenticeship", es: "Aprendizaje" },
];

export function etiquetaModalidad(valor: TipoUbicacion | undefined, idioma: Idioma): string {
  if (!valor) return "";
  const encontrado = MODALIDAD_OPCIONES.find((o) => o.value === valor);
  return encontrado ? encontrado[idioma] : "";
}

export function etiquetaTipoEmpleo(valor: TipoEmpleo | undefined, idioma: Idioma): string {
  if (!valor) return "";
  const encontrado = TIPO_EMPLEO_OPCIONES.find((o) => o.value === valor);
  return encontrado ? encontrado[idioma] : "";
}

export function formatearFechaMesAnio(mes: string | undefined, anio: string | undefined, idioma: Idioma): string {
  const a = (anio ?? "").trim();
  const m = (mes ?? "").trim();
  if (!a && !m) return "";
  const mesObj = MESES_OPCIONES.find((x) => x.value === m && x.value !== "");
  if (mesObj && a) return `${mesObj[idioma]} ${a}`;
  if (mesObj) return mesObj[idioma];
  return a;
}

export function formatearPeriodoLinkedin(
  params: {
    mesInicio?: string;
    anioInicio?: string;
    mesFin?: string;
    anioFin?: string;
    actual?: boolean;
    periodoFallback?: string;
  },
  idioma: Idioma,
): string {
  const inicio = formatearFechaMesAnio(params.mesInicio, params.anioInicio, idioma);
  if (!inicio) return params.periodoFallback ?? "";
  const fin = params.actual
    ? idioma === "es"
      ? "Actualidad"
      : "Present"
    : formatearFechaMesAnio(params.mesFin, params.anioFin, idioma);
  return fin ? `${inicio} – ${fin}` : inicio;
}

export type TextosExperiencia = {
  periodo: string;
  rol: string;
  detalle: string[];
  periodoTotal?: string;
  roles?: RolExperiencia[];
};

export type ExperienciaItem = {
  id: string;
  empresa: string;
  logo: string;
  en: TextosExperiencia;
  es: TextosExperiencia;
};

const LOGOS_BASE = [
  "/subida-1b5814c4.png",
  "/subida-eda350f3.png",
  "/subida-fa641c24.png",
  "/subida-5f3afc56.png",
];

export const EXPERIENCIA_BASE: ExperienciaItem[] = contenido.en.experiencia.map((e, i) => {
  const es = contenido.es.experiencia[i];
  const enObj: TextosExperiencia = {
    periodo: e.periodo,
    rol: e.rol,
    detalle: e.detalle,
    ...(e.periodoTotal ? { periodoTotal: e.periodoTotal } : {}),
    ...(e.roles ? { roles: e.roles } : {}),
  };
  const esObj: TextosExperiencia = es
    ? {
        periodo: es.periodo,
        rol: es.rol,
        detalle: es.detalle,
        ...(es.periodoTotal ? { periodoTotal: es.periodoTotal } : {}),
        ...(es.roles ? { roles: es.roles } : {}),
      }
    : enObj;

  return {
    id: `base-${i}`,
    empresa: e.empresa,
    logo: LOGOS_BASE[i] ?? "",
    en: enObj,
    es: esObj,
  };
});

const CLAVE_EXPERIENCIA = "portafolio-experiencia";
const TABLA_EXPERIENCIA = "experiencia_portafolio";

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

export function guardarExperienciaLocal(lista: ExperienciaItem[]): boolean {
  try {
    window.localStorage.setItem(CLAVE_EXPERIENCIA, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export async function cargarExperienciaRemota(): Promise<ExperienciaItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLA_EXPERIENCIA as never)
      .select("id, empresa, logo, en, es, orden")
      .order("orden", { ascending: true });

    if (error || !Array.isArray(data)) {
      return cargarExperiencia();
    }

    if (data.length === 0) {
      return EXPERIENCIA_BASE;
    }

    const mapeados: ExperienciaItem[] = (
      data as {
        id: string;
        empresa: string;
        logo: string | null;
        en: TextosExperiencia;
        es: TextosExperiencia;
      }[]
    ).map((row) => ({
      id: row.id,
      empresa: row.empresa,
      logo: row.logo ?? "",
      en: row.en,
      es: row.es,
    }));

    guardarExperienciaLocal(mapeados);
    return mapeados;
  } catch {
    return cargarExperiencia();
  }
}

export async function guardarExperienciaRemota(lista: ExperienciaItem[]): Promise<boolean> {
  guardarExperienciaLocal(lista);
  try {
    const filas = lista.map((item, idx) => ({
      id: item.id,
      orden: idx,
      empresa: item.empresa,
      logo: item.logo ?? "",
      en: item.en,
      es: item.es,
      actualizado_en: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from(TABLA_EXPERIENCIA as never)
      .upsert(filas as never, { onConflict: "id" });

    return !error;
  } catch {
    return false;
  }
}

export async function eliminarExperienciaRemota(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLA_EXPERIENCIA as never)
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function restablecerExperienciaRemota(): Promise<ExperienciaItem[]> {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CLAVE_EXPERIENCIA);
  }
  try {
    await supabase.from(TABLA_EXPERIENCIA as never).delete().neq("id", "");
    await guardarExperienciaRemota(EXPERIENCIA_BASE);
  } catch {
    // Si no hay conexión remota, devuelve EXPERIENCIA_BASE localmente
  }
  return EXPERIENCIA_BASE;
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
  {
    id: "edu-base",
    logo: LOGO_UPN,
    archivo: ARCHIVO_UPN,
    en: contenido.en.educacion,
    es: contenido.es.educacion,
  },
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