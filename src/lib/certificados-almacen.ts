/* eslint-disable prettier/prettier */
import { supabase } from "@/integrations/supabase/client";

export type Certificado = {
  nombre: string;
  emisor: string;
  imagen: string;
  logo: string;
  vigencia?: string;
};

const LOGO_KASEYA = "/subida-f9236da8.png";
const LOGO_AWS = "/subida-3062d89b.png";
const LOGO_AUVIK = "/subida-927c6d26.png";
const LOGO_CISCO = "/subida-01000ddd.png";
const LOGO_CODERHOUSE = "/subida-d05262d0.png";

export const CERTIFICADOS_BASE: Certificado[] = [
  {
    nombre: "Auvik Certified Administrator (ACA)",
    emisor: "Auvik",
    logo: LOGO_AUVIK,
    imagen: "/subida-d4e84109.png",
    vigencia: "08/2025 – 08/2028",
  },
  { nombre: "AWS Educate – Compute", emisor: "AWS Educate", logo: LOGO_AWS, imagen: "/subida-939012d5.png" },
  { nombre: "AWS Educate – Databases", emisor: "AWS Educate", logo: LOGO_AWS, imagen: "/subida-f7f4cfc9.png" },
  { nombre: "AWS Educate – Storage", emisor: "AWS Educate", logo: LOGO_AWS, imagen: "/subida-948c59d4.png" },
  {
    nombre: "Coderhouse Cybersecurity",
    emisor: "Coderhouse",
    logo: LOGO_CODERHOUSE,
    imagen: "/subida-cce6087b.png",
    vigencia: "07/2023",
  },
  {
    nombre: "Kaseya Certified Technician in Cybersecurity",
    emisor: "Kaseya University",
    logo: LOGO_KASEYA,
    imagen: "/subida-2bb39db0.png",
  },
  {
    nombre: "Kaseya Certified Technician in Datto Backup for Microsoft Azure",
    emisor: "Kaseya University",
    logo: LOGO_KASEYA,
    imagen: "/subida-b9c04fa2.png",
    vigencia: "08/2025 – 08/2027",
  },
  {
    nombre: "Kaseya Certified Technician in VSA9",
    emisor: "Kaseya University",
    logo: LOGO_KASEYA,
    imagen: "/subida-109d5f35.png",
    vigencia: "08/2025 – 08/2027",
  },
  {
    nombre: "NDG Linux Essentials",
    emisor: "Cisco Networking Academy",
    logo: LOGO_CISCO,
    imagen: "/subida-6a6671b8.png",
    vigencia: "07/2021",
  },
  {
    nombre: "Umbrella 101 for Field Engineers",
    emisor: "Cisco",
    logo: LOGO_CISCO,
    imagen: "/subida-90df24a0.png",
    vigencia: "07/2023",
  },
];

const CLAVE_CERTIFICADOS = "portafolio-certificados";
const TABLA_CERTIFICADOS = "certificados_portafolio";

export function ordenarCertificados(lista: Certificado[]): Certificado[] {
  return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "en"));
}

export function cargarCertificados(): Certificado[] {
  if (typeof window === "undefined") return CERTIFICADOS_BASE;
  try {
    const guardado = window.localStorage.getItem(CLAVE_CERTIFICADOS);
    if (!guardado) return CERTIFICADOS_BASE;
    const datos: unknown = JSON.parse(guardado);
    return Array.isArray(datos) ? (datos as Certificado[]) : CERTIFICADOS_BASE;
  } catch {
    return CERTIFICADOS_BASE;
  }
}

export function guardarCertificados(lista: Certificado[]): boolean {
  try {
    window.localStorage.setItem(CLAVE_CERTIFICADOS, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export function restablecerCertificados(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CLAVE_CERTIFICADOS);
  }
}

export async function cargarCertificadosRemotos(): Promise<Certificado[]> {
  try {
    const { data, error } = await supabase
      .from(TABLA_CERTIFICADOS as never)
      .select("nombre, emisor, vigencia, imagen, logo");

    if (error || !Array.isArray(data)) {
      return ordenarCertificados(cargarCertificados());
    }

    if (data.length === 0) {
      return ordenarCertificados(CERTIFICADOS_BASE);
    }

    const mapeados: Certificado[] = (
      data as {
        nombre: string;
        emisor: string | null;
        vigencia: string | null;
        imagen: string | null;
        logo: string | null;
      }[]
    ).map((row) => ({
      nombre: row.nombre,
      emisor: row.emisor ?? "",
      imagen: row.imagen ?? "",
      logo: row.logo ?? "",
      ...(row.vigencia ? { vigencia: row.vigencia } : {}),
    }));

    const ordenada = ordenarCertificados(mapeados);
    guardarCertificados(ordenada);
    return ordenada;
  } catch {
    return ordenarCertificados(cargarCertificados());
  }
}

export async function guardarCertificadosRemotos(lista: Certificado[]): Promise<boolean> {
  const ordenada = ordenarCertificados(lista);
  guardarCertificados(ordenada);
  try {
    const filas = ordenada.map((c) => ({
      nombre: c.nombre,
      emisor: c.emisor,
      vigencia: c.vigencia ?? null,
      imagen: c.imagen,
      logo: c.logo,
      actualizado_en: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from(TABLA_CERTIFICADOS as never)
      .upsert(filas as never, { onConflict: "nombre" });

    return !error;
  } catch {
    return false;
  }
}

export async function eliminarCertificadoRemoto(nombre: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLA_CERTIFICADOS as never)
      .delete()
      .eq("nombre", nombre);
    return !error;
  } catch {
    return false;
  }
}

export async function restablecerCertificadosRemotos(): Promise<Certificado[]> {
  restablecerCertificados();
  try {
    await supabase.from(TABLA_CERTIFICADOS as never).delete().neq("nombre", "");
    await guardarCertificadosRemotos(CERTIFICADOS_BASE);
  } catch {
    // Respaldo local si no hay conexión
  }
  return ordenarCertificados(CERTIFICADOS_BASE);
}