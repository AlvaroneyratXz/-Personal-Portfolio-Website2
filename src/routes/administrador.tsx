import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, EyeOff, LogOut, Pencil, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import {
  cargarCertificados,
  guardarCertificados,
  ordenarCertificados,
  restablecerCertificados,
  type Certificado,
} from "../lib/certificados-almacen";
import {
  cargarHero,
  guardarHero,
  HERO_BASE,
  restablecerHero,
  type HeroDatos,
  type TextosHero,
} from "../lib/hero-almacen";
import {
  cargarEducacion,
  cargarExperiencia,
  guardarEducacion,
  guardarExperiencia,
  restablecerEducacion,
  restablecerExperiencia,
  type EducacionItem,
  type ExperienciaItem,
} from "../lib/experiencia-almacen";

export const Route = createFileRoute("/administrador")({
  head: () => ({
    meta: [
      { title: "Administrador | Alvaro Jose Neyra Sáenz" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Administrador,
});

const CORREO_INTERNO = "administrador@portafolio-admin.com";
const CLAVE_RECORDAR = "portafolio-admin-recordar";
const CLAVE_TEMPORAL = "portafolio-admin-temporal";

async function esAdministrador(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const usuario = data.session?.user;
  if (!usuario) return false;
  const { data: ok } = await supabase.rpc("has_role", { _user_id: usuario.id, _role: "admin" });
  return ok === true;
}
const MAX_ARCHIVO = 2_500_000;
const CAMPO =
  "w-full rounded-md border border-input bg-secondary px-3 py-2 text-base outline-none transition focus:border-ojos";
const BOTON =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition hover:brightness-110";

type Borrador = { nombre: string; emisor: string; vigencia: string; imagen: string; logo: string };
const BORRADOR_VACIO: Borrador = { nombre: "", emisor: "", vigencia: "", imagen: "", logo: "" };

function Administrador() {
  const [listo, setListo] = useState(false);
  const [entrado, setEntrado] = useState(false);

  useEffect(() => {
    let activo = true;
    const recordado =
      window.localStorage.getItem(CLAVE_RECORDAR) === "1" || window.sessionStorage.getItem(CLAVE_TEMPORAL) === "1";
    (async () => {
      if (!recordado) {
        await supabase.auth.signOut();
      }
      const ok = recordado ? await esAdministrador() : false;
      if (!activo) return;
      setEntrado(ok);
      setListo(true);
    })();
    return () => {
      activo = false;
    };
  }, []);

  if (!listo) return null;
  if (!entrado) return <Acceso alEntrar={() => setEntrado(true)} />;

  const salir = () => {
    window.localStorage.removeItem(CLAVE_RECORDAR);
    window.sessionStorage.removeItem(CLAVE_TEMPORAL);
    void supabase.auth.signOut();
    setEntrado(false);
  };
  return <Panel alSalir={salir} />;
}

function Acceso({ alEntrar }: { alEntrar: () => void }) {
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState("");
  const fallos = useRef<number>(0);
  const bloqueoHasta = useRef<number>(0);

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    if (Date.now() < bloqueoHasta.current) {
      setError("Demasiados intentos. Espera medio minuto e inténtalo de nuevo.");
      return;
    }
    const { error: fallo } = await supabase.auth.signInWithPassword({ email: CORREO_INTERNO, password: clave });
    const esAdmin = fallo ? false : await esAdministrador();
    if (fallo || !esAdmin) {
      if (!fallo) await supabase.auth.signOut();
      fallos.current += 1;
      if (fallos.current >= 5) {
        bloqueoHasta.current = Date.now() + 30_000;
        fallos.current = 0;
      }
      if (!fallo) {
        setError("La contraseña es correcta, pero la cuenta aún no tiene permiso de administrador. Intenta de nuevo en un minuto.");
      } else if (/email logins are disabled/i.test(fallo.message)) {
        setError("El inicio de sesión con correo está desactivado en el proyecto. Actívalo en Lovable Cloud (Users > Auth settings > Email).");
      } else if (fallo.status === 400 && /invalid login/i.test(fallo.message)) {
        setError("Contraseña incorrecta, o la cuenta del administrador aún se está preparando. Espera un minuto e inténtalo otra vez.");
      } else {
        setError(`No se pudo iniciar sesión: ${fallo.message}`);
      }
      return;
    }
    fallos.current = 0;
    setClave("");
    if (recordar) {
      window.localStorage.setItem(CLAVE_RECORDAR, "1");
      window.sessionStorage.removeItem(CLAVE_TEMPORAL);
    } else {
      window.localStorage.removeItem(CLAVE_RECORDAR);
      window.sessionStorage.setItem(CLAVE_TEMPORAL, "1");
    }
    alEntrar();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <form onSubmit={entrar} noValidate className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </a>
        <h1 className="text-xl font-bold">Administrador</h1>
        <div>
          <label htmlFor="clave-admin" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="clave-admin"
              type={verClave ? "text" : "password"}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className={`${CAMPO} pr-10`}
              autoComplete="current-password"
              maxLength={128}
            />
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              {verClave ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={recordar}
            onChange={(e) => setRecordar(e.target.checked)}
            className="h-4 w-4 accent-ojos"
          />
          Recordarme
        </label>
        {error && <p className="text-sm text-sharingan">{error}</p>}
        <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground`}>
          Entrar
        </button>
      </form>
    </main>
  );
}

function Panel({ alSalir }: { alSalir: () => void }) {
  const [lista, setLista] = useState<Certificado[]>([]);
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setLista(ordenarCertificados(cargarCertificados()));
  }, []);

  const guardar = (nueva: Certificado[]): boolean => {
    const ordenada = ordenarCertificados(nueva);
    if (!guardarCertificados(ordenada)) {
      setMensaje("No se pudo guardar: el archivo es demasiado grande. Usa una imagen más ligera.");
      return false;
    }
    setLista(ordenada);
    setMensaje("Cambios guardados. Abre la página principal para verlos.");
    return true;
  };

  const cerrarForm = () => {
    setFormAbierto(false);
    setEditando(null);
  };

  const abrirNuevo = () => {
    setEditando(null);
    setBorrador(BORRADOR_VACIO);
    setFormAbierto(true);
  };

  const abrirEditar = (c: Certificado) => {
    setEditando(c.nombre);
    setBorrador({
      nombre: c.nombre,
      emisor: c.emisor,
      vigencia: c.vigencia ?? "",
      imagen: c.imagen,
      logo: c.logo,
    });
    setFormAbierto(true);
  };

  const guardarForm = (e: FormEvent) => {
    e.preventDefault();
    const nombre = borrador.nombre.trim();
    if (nombre.length < 3) {
      setMensaje("Escribe el nombre del certificado.");
      return;
    }
    const nuevo: Certificado = {
      nombre,
      emisor: borrador.emisor.trim(),
      imagen: borrador.imagen,
      logo: borrador.logo,
    };
    if (borrador.vigencia.trim()) nuevo.vigencia = borrador.vigencia.trim();
    const sinEste = editando === null ? lista : lista.filter((c) => c.nombre !== editando);
    if (guardar([...sinEste, nuevo])) cerrarForm();
  };

  const borrar = (nombre: string) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    guardar(lista.filter((c) => c.nombre !== nombre));
  };

  const restablecer = () => {
    if (!window.confirm("¿Volver a los certificados originales? Se perderán tus cambios.")) return;
    restablecerCertificados();
    setLista(ordenarCertificados(cargarCertificados()));
    setMensaje("Certificados restablecidos.");
  };

  const cargarArchivo = (archivo: File | undefined, campo: "imagen" | "logo") => {
    if (!archivo) return;
    const permitidos = campo === "logo" ? ["image/png", "image/jpeg"] : ["image/png", "image/jpeg", "application/pdf"];
    if (!permitidos.includes(archivo.type)) {
      setMensaje(campo === "logo" ? "El logo debe ser PNG o JPG." : "Solo se aceptan archivos PNG, JPG o PDF.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO) {
      setMensaje("El archivo es demasiado grande (máximo 2.5 MB).");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const datos = lector.result;
      if (typeof datos === "string") setBorrador((b) => ({ ...b, [campo]: datos }));
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:py-8 lg:max-w-5xl">

      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Administrador de certificados</h1>
        <div className="flex flex-wrap gap-2">
          <a href="/" className={`${BOTON} border border-border text-foreground`}>
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </a>
          <button type="button" onClick={alSalir} className={`${BOTON} border border-border text-foreground`}>
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      {mensaje && <p className="rounded-md border border-ojos/40 bg-card p-3 text-sm text-ojos">{mensaje}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={abrirNuevo} className={`${BOTON} bg-sharingan text-foreground`}>
          <Plus className="h-4 w-4" />
          Agregar certificado
        </button>
        <button type="button" onClick={restablecer} className={`${BOTON} border border-border text-foreground`}>
          <RotateCcw className="h-4 w-4" />
          Restablecer
        </button>
      </div>

      {formAbierto && (
        <form onSubmit={guardarForm} noValidate className="min-w-0 space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{editando === null ? "Nuevo certificado" : "Editar certificado"}</h2>
            <button type="button" onClick={cerrarForm} aria-label="Cerrar" className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre</label>
            <input className={CAMPO} value={borrador.nombre} maxLength={150} onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Emisor</label>
            <input className={CAMPO} value={borrador.emisor} maxLength={80} onChange={(e) => setBorrador({ ...borrador, emisor: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Vigencia (opcional)</label>
            <input className={CAMPO} value={borrador.vigencia} maxLength={40} onChange={(e) => setBorrador({ ...borrador, vigencia: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">Certificado (PNG, JPG o PDF)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => cargarArchivo(e.target.files?.[0], "imagen")}
                className="w-full text-sm"
              />
              {borrador.imagen && <p className="mt-1 text-xs text-muted-foreground">Archivo cargado</p>}
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">Logo (PNG o JPG)</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => cargarArchivo(e.target.files?.[0], "logo")}
                className="w-full text-sm"
              />
              {borrador.logo && (
                <img
                  src={borrador.logo}
                  alt="Logo cargado"
                  className="mt-2 h-14 w-14 rounded-md border border-border bg-white object-contain p-1"
                />
              )}
            </div>
          </div>
          <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground sm:w-auto`}>
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {lista.map((c) => (
          <li key={c.nombre} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold [overflow-wrap:anywhere]">{c.nombre}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {c.emisor}
                {c.vigencia ? ` · ${c.vigencia}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => abrirEditar(c)}
              aria-label={`Editar ${c.nombre}`}
              className="rounded-md border border-border p-2 hover:text-ojos"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => borrar(c.nombre)}
              aria-label={`Eliminar ${c.nombre}`}
              className="rounded-md border border-border p-2 hover:text-sharingan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <PanelPortada />
      <PanelExperiencia />
      <PanelEducacion />
    </main>
  );
}

function PanelPortada() {
  const [datos, setDatos] = useState<HeroDatos>(HERO_BASE);
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setDatos(cargarHero());
  }, []);

  const cambiarIdioma = (idioma: "en" | "es", campo: keyof TextosHero, valor: string) =>
    setDatos((d) => ({ ...d, [idioma]: { ...d[idioma], [campo]: valor } }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (datos.nombre.trim().length < 2) {
      setMensaje("Escribe tu nombre.");
      return;
    }
    if (!guardarHero(datos)) {
      setMensaje("No se pudo guardar los cambios.");
      return;
    }
    setMensaje("Portada guardada. Abre la página principal para verla.");
    setAbierto(false);
  };

  const restablecer = () => {
    if (!window.confirm("¿Volver a la portada original? Se perderán tus cambios.")) return;
    restablecerHero();
    setDatos(cargarHero());
    setMensaje("Portada restablecida.");
    setAbierto(false);
  };

  const idiomas: { clave: "en" | "es"; nombre: string }[] = [
    { clave: "en", nombre: "Inglés" },
    { clave: "es", nombre: "Español" },
  ];

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-2xl font-bold">Portada (Hello, I'm)</h2>
      {mensaje && <p className="rounded-md border border-ojos/40 bg-card p-3 text-sm text-ojos">{mensaje}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setAbierto(true)} className={`${BOTON} bg-sharingan text-foreground`}>
          <Pencil className="h-4 w-4" />
          Editar portada
        </button>
        <button type="button" onClick={restablecer} className={`${BOTON} border border-border text-foreground`}>
          <RotateCcw className="h-4 w-4" />
          Restablecer
        </button>
      </div>

      {!abierto && (
        <div className="min-w-0 rounded-lg border border-border bg-card p-3">
          <p className="font-semibold [overflow-wrap:anywhere]">{datos.nombre}</p>
          <p className="text-sm text-ojos [overflow-wrap:anywhere]">{datos.es.titulo}</p>
          <p className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
            {datos.telefono} · {datos.correo}
          </p>
        </div>
      )}

      {abierto && (
        <form onSubmit={enviar} noValidate className="min-w-0 space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Editar portada</h3>
            <button
              type="button"
              onClick={() => {
                setDatos(cargarHero());
                setAbierto(false);
              }}
              aria-label="Cerrar"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre</label>
            <input className={CAMPO} value={datos.nombre} maxLength={80} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">Teléfono</label>
              <input className={CAMPO} value={datos.telefono} maxLength={30} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">LinkedIn (enlace)</label>
              <input className={CAMPO} value={datos.linkedin} maxLength={150} onChange={(e) => setDatos({ ...datos, linkedin: e.target.value })} />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">Correo</label>
              <input className={CAMPO} value={datos.correo} maxLength={100} onChange={(e) => setDatos({ ...datos, correo: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {idiomas.map(({ clave, nombre }) => (
              <div key={clave} className="min-w-0 space-y-3">
                <p className="text-sm font-bold">{nombre}</p>
                <input className={CAMPO} placeholder="Saludo" value={datos[clave].saludo} maxLength={60} onChange={(e) => cambiarIdioma(clave, "saludo", e.target.value)} />
                <input className={CAMPO} placeholder="Puesto" value={datos[clave].titulo} maxLength={120} onChange={(e) => cambiarIdioma(clave, "titulo", e.target.value)} />
                <input className={CAMPO} placeholder="Subtítulo" value={datos[clave].subtitulo} maxLength={200} onChange={(e) => cambiarIdioma(clave, "subtitulo", e.target.value)} />
                <input className={CAMPO} placeholder="Frase" value={datos[clave].lema} maxLength={200} onChange={(e) => cambiarIdioma(clave, "lema", e.target.value)} />
                <textarea className={CAMPO} rows={8} placeholder="Biografía" value={datos[clave].bio} onChange={(e) => cambiarIdioma(clave, "bio", e.target.value)} />
              </div>
            ))}
          </div>
          <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground sm:w-auto`}>
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </form>
      )}
    </section>
  );
}

type BorradorEdu = { tituloEn: string; lugarEn: string; tituloEs: string; lugarEs: string; logo: string; archivo: string };
const EDU_VACIA: BorradorEdu = { tituloEn: "", lugarEn: "", tituloEs: "", lugarEs: "", logo: "", archivo: "" };

function PanelEducacion() {
  const [lista, setLista] = useState<EducacionItem[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [b, setB] = useState<BorradorEdu>(EDU_VACIA);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setLista(cargarEducacion());
  }, []);

  const guardar = (nueva: EducacionItem[]): boolean => {
    if (!guardarEducacion(nueva)) {
      setMensaje("No se pudo guardar los cambios.");
      return false;
    }
    setLista(nueva);
    setMensaje("Educación guardada. Abre la página principal para verla.");
    return true;
  };

  const abrirNuevo = () => {
    setEditando(null);
    setB(EDU_VACIA);
    setAbierto(true);
  };

  const abrirEditar = (it: EducacionItem) => {
    setEditando(it.id);
    setB({ tituloEn: it.en.titulo, lugarEn: it.en.lugar, tituloEs: it.es.titulo, lugarEs: it.es.lugar, logo: it.logo, archivo: it.archivo });
    setAbierto(true);
  };

  const cargarArchivoEdu = (archivo: File | undefined) => {
    if (!archivo) return;
    if (!["image/png", "image/jpeg", "application/pdf"].includes(archivo.type)) {
      setMensaje("Solo se aceptan archivos PDF, PNG o JPG.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO) {
      setMensaje("El archivo es demasiado grande (máximo 2.5 MB).");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const datos = lector.result;
      if (typeof datos === "string") setB((x) => ({ ...x, archivo: datos }));
    };
    lector.readAsDataURL(archivo);
  };

  const cargarLogoEdu = (archivo: File | undefined) => {
    if (!archivo) return;
    if (!["image/png", "image/jpeg"].includes(archivo.type)) {
      setMensaje("El logo debe ser PNG o JPG.");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const datos = lector.result;
      if (typeof datos === "string") setB((x) => ({ ...x, logo: datos }));
    };
    lector.readAsDataURL(archivo);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const en = { titulo: b.tituloEn.trim(), lugar: b.lugarEn.trim() };
    const es = { titulo: b.tituloEs.trim(), lugar: b.lugarEs.trim() };
    if (!en.titulo && !es.titulo) {
      setMensaje("Escribe el título de la carrera o estudio.");
      return;
    }
    const nuevo: EducacionItem = {
      id: editando ?? `edu-${Date.now()}`,
      logo: b.logo,
      archivo: b.archivo,
      en: en.titulo ? en : es,
      es: es.titulo ? es : en,
    };
    const siguiente = editando === null ? [nuevo, ...lista] : lista.map((x) => (x.id === editando ? nuevo : x));
    if (guardar(siguiente)) {
      setAbierto(false);
      setEditando(null);
    }
  };

  const borrar = (it: EducacionItem) => {
    if (!window.confirm(`¿Eliminar "${it.es.titulo || it.en.titulo}"?`)) return;
    guardar(lista.filter((x) => x.id !== it.id));
  };

  const restablecer = () => {
    if (!window.confirm("¿Volver a la educación original? Se perderán tus cambios.")) return;
    restablecerEducacion();
    setLista(cargarEducacion());
    setMensaje("Educación restablecida.");
  };

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-2xl font-bold">Educación</h2>
      {mensaje && <p className="rounded-md border border-ojos/40 bg-card p-3 text-sm text-ojos">{mensaje}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={abrirNuevo} className={`${BOTON} bg-sharingan text-foreground`}>
          <Plus className="h-4 w-4" />
          Agregar educación
        </button>
        <button type="button" onClick={restablecer} className={`${BOTON} border border-border text-foreground`}>
          <RotateCcw className="h-4 w-4" />
          Restablecer
        </button>
      </div>

      {abierto && (
        <form onSubmit={enviar} noValidate className="min-w-0 space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editando === null ? "Nueva educación" : "Editar educación"}</h3>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Logo (PNG o JPG)</label>
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => cargarLogoEdu(e.target.files?.[0])} className="w-full text-sm" />
            {b.logo && (
              <div className="mt-2 flex items-center gap-3">
                <img src={b.logo} alt="Logo cargado" className="h-14 w-14 rounded-md border border-border bg-white object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setB({ ...b, logo: "" })}
                  className={`${BOTON} border border-border text-foreground`}
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar logo
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Certificado o diploma (PDF, PNG o JPG)</label>
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              onChange={(e) => cargarArchivoEdu(e.target.files?.[0])}
              className="w-full text-sm"
            />
            {b.archivo && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-xs text-muted-foreground">Archivo cargado</p>
                <button
                  type="button"
                  onClick={() => setB({ ...b, archivo: "" })}
                  className={`${BOTON} border border-border text-foreground`}
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar archivo
                </button>
              </div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-bold">Inglés</p>
              <input className={CAMPO} placeholder="Título" value={b.tituloEn} maxLength={150} onChange={(e) => setB({ ...b, tituloEn: e.target.value })} />
              <input className={CAMPO} placeholder="Institución y año" value={b.lugarEn} maxLength={150} onChange={(e) => setB({ ...b, lugarEn: e.target.value })} />
            </div>
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-bold">Español</p>
              <input className={CAMPO} placeholder="Título" value={b.tituloEs} maxLength={150} onChange={(e) => setB({ ...b, tituloEs: e.target.value })} />
              <input className={CAMPO} placeholder="Institución y año" value={b.lugarEs} maxLength={150} onChange={(e) => setB({ ...b, lugarEs: e.target.value })} />
            </div>
          </div>
          <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground sm:w-auto`}>
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {lista.map((it) => (
          <li key={it.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3">
            {it.logo && (
              <img src={it.logo} alt="Logo" className="h-10 w-10 shrink-0 rounded-md border border-border bg-white object-contain p-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold [overflow-wrap:anywhere]">{it.es.titulo || it.en.titulo}</p>
              <p className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">{it.es.lugar || it.en.lugar}</p>
            </div>
            <button
              type="button"
              onClick={() => abrirEditar(it)}
              aria-label="Editar educación"
              className="rounded-md border border-border p-2 hover:text-ojos"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => borrar(it)}
              aria-label="Eliminar educación"
              className="rounded-md border border-border p-2 hover:text-sharingan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

type BorradorExp = {
  empresa: string;
  logo: string;
  periodoEn: string;
  rolEn: string;
  detalleEn: string;
  periodoEs: string;
  rolEs: string;
  detalleEs: string;
};
const EXP_VACIA: BorradorExp = {
  empresa: "",
  logo: "",
  periodoEn: "",
  rolEn: "",
  detalleEn: "",
  periodoEs: "",
  rolEs: "",
  detalleEs: "",
};

function PanelExperiencia() {
  const [lista, setLista] = useState<ExperienciaItem[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [b, setB] = useState<BorradorExp>(EXP_VACIA);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setLista(cargarExperiencia());
  }, []);

  const guardar = (nueva: ExperienciaItem[]): boolean => {
    if (!guardarExperiencia(nueva)) {
      setMensaje("No se pudo guardar: el logo es demasiado grande. Usa una imagen más ligera.");
      return false;
    }
    setLista(nueva);
    setMensaje("Experiencia guardada. Abre la página principal para verla.");
    return true;
  };

  const lineas = (s: string) =>
    s
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

  const abrirNuevo = () => {
    setEditando(null);
    setB(EXP_VACIA);
    setAbierto(true);
  };

  const abrirEditar = (it: ExperienciaItem) => {
    setEditando(it.id);
    setB({
      empresa: it.empresa,
      logo: it.logo,
      periodoEn: it.en.periodo,
      rolEn: it.en.rol,
      detalleEn: it.en.detalle.join("\n"),
      periodoEs: it.es.periodo,
      rolEs: it.es.rol,
      detalleEs: it.es.detalle.join("\n"),
    });
    setAbierto(true);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const empresa = b.empresa.trim();
    if (empresa.length < 2) {
      setMensaje("Escribe el nombre de la empresa.");
      return;
    }
    const en = { periodo: b.periodoEn.trim(), rol: b.rolEn.trim(), detalle: lineas(b.detalleEn) };
    const es = { periodo: b.periodoEs.trim(), rol: b.rolEs.trim(), detalle: lineas(b.detalleEs) };
    // Si un idioma queda vacío, se reutiliza el otro.
    const nuevo: ExperienciaItem = {
      id: editando ?? `exp-${Date.now()}`,
      empresa,
      logo: b.logo,
      en: en.rol || en.periodo || en.detalle.length ? en : es,
      es: es.rol || es.periodo || es.detalle.length ? es : en,
    };
    const siguiente =
      editando === null ? [nuevo, ...lista] : lista.map((x) => (x.id === editando ? nuevo : x));
    if (guardar(siguiente)) {
      setAbierto(false);
      setEditando(null);
    }
  };

  const borrar = (it: ExperienciaItem) => {
    if (!window.confirm(`¿Eliminar "${it.empresa}"?`)) return;
    guardar(lista.filter((x) => x.id !== it.id));
  };

  const restablecer = () => {
    if (!window.confirm("¿Volver a la experiencia original? Se perderán tus cambios.")) return;
    restablecerExperiencia();
    setLista(cargarExperiencia());
    setMensaje("Experiencia restablecida.");
  };

  const cargarLogo = (archivo: File | undefined) => {
    if (!archivo) return;
    if (!["image/png", "image/jpeg"].includes(archivo.type)) {
      setMensaje("El logo debe ser PNG o JPG.");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const datos = lector.result;
      if (typeof datos === "string") setB((x) => ({ ...x, logo: datos }));
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-2xl font-bold">Experiencia profesional</h2>
      {mensaje && <p className="rounded-md border border-ojos/40 bg-card p-3 text-sm text-ojos">{mensaje}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={abrirNuevo} className={`${BOTON} bg-sharingan text-foreground`}>
          <Plus className="h-4 w-4" />
          Agregar experiencia
        </button>
        <button type="button" onClick={restablecer} className={`${BOTON} border border-border text-foreground`}>
          <RotateCcw className="h-4 w-4" />
          Restablecer
        </button>
      </div>

      {abierto && (
        <form onSubmit={enviar} noValidate className="min-w-0 space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editando === null ? "Nueva experiencia" : "Editar experiencia"}</h3>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Empresa</label>
            <input className={CAMPO} value={b.empresa} maxLength={80} onChange={(e) => setB({ ...b, empresa: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Logo (PNG o JPG)</label>
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => cargarLogo(e.target.files?.[0])} className="w-full text-sm" />
            {b.logo && (
              <img src={b.logo} alt="Logo cargado" className="mt-2 h-14 w-14 rounded-md border border-border bg-white object-contain p-1" />
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-bold">Inglés</p>
              <input className={CAMPO} placeholder="Periodo" value={b.periodoEn} maxLength={60} onChange={(e) => setB({ ...b, periodoEn: e.target.value })} />
              <input className={CAMPO} placeholder="Puesto" value={b.rolEn} maxLength={120} onChange={(e) => setB({ ...b, rolEn: e.target.value })} />
              <textarea className={CAMPO} rows={6} placeholder="Logros (uno por línea)" value={b.detalleEn} onChange={(e) => setB({ ...b, detalleEn: e.target.value })} />
            </div>
            <div className="min-w-0 space-y-3">
              <p className="text-sm font-bold">Español</p>
              <input className={CAMPO} placeholder="Periodo" value={b.periodoEs} maxLength={60} onChange={(e) => setB({ ...b, periodoEs: e.target.value })} />
              <input className={CAMPO} placeholder="Puesto" value={b.rolEs} maxLength={120} onChange={(e) => setB({ ...b, rolEs: e.target.value })} />
              <textarea className={CAMPO} rows={6} placeholder="Logros (uno por línea)" value={b.detalleEs} onChange={(e) => setB({ ...b, detalleEs: e.target.value })} />
            </div>
          </div>
          <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground sm:w-auto`}>
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {lista.map((it) => (
          <li key={it.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold [overflow-wrap:anywhere]">{it.empresa}</p>
              <p className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                {it.es.rol || it.en.rol}
                {it.es.periodo || it.en.periodo ? ` · ${it.es.periodo || it.en.periodo}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => abrirEditar(it)}
              aria-label={`Editar ${it.empresa}`}
              className="rounded-md border border-border p-2 hover:text-ojos"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => borrar(it)}
              aria-label={`Eliminar ${it.empresa}`}
              className="rounded-md border border-border p-2 hover:text-sharingan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
