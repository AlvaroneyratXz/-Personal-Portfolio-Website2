/* eslint-disable prettier/prettier */
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
  ANIOS_OPCIONES,
  cargarEducacion,
  cargarExperienciaRemota,
  eliminarExperienciaRemota,
  etiquetaTipoEmpleo,
  formatearPeriodoLinkedin,
  guardarEducacion,
  guardarExperienciaLocal,
  guardarExperienciaRemota,
  MESES_OPCIONES,
  MODALIDAD_OPCIONES,
  restablecerEducacion,
  restablecerExperienciaRemota,
  TIPO_EMPLEO_OPCIONES,
  type EducacionItem,
  type ExperienciaItem,
  type RolExperiencia,
  type TipoEmpleo,
  type TipoUbicacion,
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
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return false;

    const { data: ok, error: rpcError } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "admin",
    });

    if (rpcError || ok !== true) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
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
        setError("La contraseña es correcta, pero la cuenta no posee privilegios de administrador autorizados.");
      } else if (/email logins are disabled/i.test(fallo.message)) {
        setError("El inicio de sesión con correo está desactivado en el proyecto.");
      } else if (fallo.status === 400 && /invalid login/i.test(fallo.message)) {
        setError("Credenciales incorrectas o cuenta en proceso de verificación.");
      } else {
        setError("Acceso denegado. Verifique sus credenciales de seguridad.");
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
        <h1 className="text-xl font-bold">Administrador Seguro</h1>
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
      setMensaje("No se pudo guardar: el archivo es demasiado grande.");
      return false;
    }
    setLista(ordenada);
    setMensaje("Cambios guardados de forma segura.");
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
    if (!window.confirm("¿Volver a los certificados originales?")) return;
    restablecerCertificados();
    setLista(ordenarCertificados(cargarCertificados()));
    setMensaje("Certificados restablecidos.");
  };

  const cargarArchivo = (archivo: File | undefined, campo: "imagen" | "logo") => {
    if (!archivo) return;
    const permitidos = campo === "logo" ? ["image/png", "image/jpeg"] : ["image/png", "image/jpeg", "application/pdf"];
    if (!permitidos.includes(archivo.type)) {
      setMensaje("Formato de archivo no permitido.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO) {
      setMensaje("El archivo excede el límite de 2.5 MB.");
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
        <h1 className="text-2xl font-bold">Panel de Administración Seguro</h1>
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
              <p className="font-semibold wrap-anywhere">{c.nombre}</p>
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
    setMensaje("Portada guardada exitosamente.");
    setAbierto(false);
  };

  const restablecer = () => {
    if (!window.confirm("¿Volver a la portada original?")) return;
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
      <h2 className="text-2xl font-bold">Portada</h2>
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
          <p className="font-semibold wrap-anywhere">{datos.nombre}</p>
          <p className="text-sm text-ojos wrap-anywhere">{datos.es.titulo}</p>
          <p className="font-mono text-xs text-muted-foreground wrap-anywhere">
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
              <label className="mb-1 block text-sm font-medium">LinkedIn</label>
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
    setMensaje("Educación guardada con éxito.");
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
      setMensaje("Formato no válido.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO) {
      setMensaje("El archivo excede el límite de 2.5 MB.");
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
      setMensaje("Escribe el título.");
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
    if (!window.confirm("¿Eliminar este elemento?")) return;
    guardar(lista.filter((x) => x.id !== it.id));
  };

  const restablecer = () => {
    if (!window.confirm("¿Restablecer educación original?")) return;
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
                <img src={b.logo} alt="Logo" className="h-14 w-14 rounded-md border border-border bg-white object-contain p-1" />
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
            <label className="mb-1 block text-sm font-medium">Archivo adjunto</label>
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
              <p className="font-semibold wrap-anywhere">{it.es.titulo || it.en.titulo}</p>
              <p className="font-mono text-xs text-muted-foreground wrap-anywhere">{it.es.lugar || it.en.lugar}</p>
            </div>
            <button
              type="button"
              onClick={() => abrirEditar(it)}
              aria-label="Editar"
              className="rounded-md border border-border p-2 hover:text-ojos"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => borrar(it)}
              aria-label="Eliminar"
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

type BorradorRol = {
  rolEn: string;
  rolEs: string;
  ubicacionEn: string;
  ubicacionEs: string;
  modalidad: TipoUbicacion;
  tipoEmpleo: TipoEmpleo;
  actual: boolean;
  mesInicio: string;
  anioInicio: string;
  mesFin: string;
  anioFin: string;
  periodoFallbackEn: string;
  periodoFallbackEs: string;
  detalleEn: string;
  detalleEs: string;
};

type BorradorExp = {
  empresa: string;
  logo: string;
  periodoTotalEn: string;
  periodoTotalEs: string;
  roles: BorradorRol[];
};

const ROL_VACIO: BorradorRol = {
  rolEn: "",
  rolEs: "",
  ubicacionEn: "",
  ubicacionEs: "",
  modalidad: "",
  tipoEmpleo: "",
  actual: false,
  mesInicio: "11",
  anioInicio: "2026",
  mesFin: "",
  anioFin: "",
  periodoFallbackEn: "",
  periodoFallbackEs: "",
  detalleEn: "",
  detalleEs: "",
};

const EXP_VACIA: BorradorExp = {
  empresa: "",
  logo: "",
  periodoTotalEn: "",
  periodoTotalEs: "",
  roles: [{ ...ROL_VACIO }],
};

function PanelExperiencia() {
  const [lista, setLista] = useState<ExperienciaItem[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [b, setB] = useState<BorradorExp>(EXP_VACIA);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    void cargarExperienciaRemota().then(setLista);
  }, []);

  const guardar = async (nueva: ExperienciaItem[]): Promise<boolean> => {
    const ok = await guardarExperienciaRemota(nueva);
    setLista(nueva);
    setMensaje(
      ok
        ? "Experiencia guardada en Supabase y disponible en cualquier dispositivo."
        : "Guardado localmente; revisa permisos o conexión con Supabase.",
    );
    return true;
  };

  const lineas = (s: string) =>
    s
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

  const cargarLogoExp = (archivo: File | undefined) => {
    if (!archivo) return;
    if (!["image/png", "image/jpeg"].includes(archivo.type)) {
      setMensaje("El logo debe ser PNG o JPG.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO) {
      setMensaje("El archivo excede el límite de 2.5 MB.");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const datos = lector.result;
      if (typeof datos === "string") setB((x) => ({ ...x, logo: datos }));
    };
    lector.readAsDataURL(archivo);
  };

  const abrirNuevo = () => {
    setEditando(null);
    setB({ ...EXP_VACIA, roles: [{ ...ROL_VACIO }] });
    setAbierto(true);
  };

  const abrirEditar = (it: ExperienciaItem) => {
    setEditando(it.id);
    const rolesEn =
      it.en.roles && it.en.roles.length > 0
        ? it.en.roles
        : [{ rol: it.en.rol, tipo: "", periodo: it.en.periodo, detalle: it.en.detalle }];
    const rolesEs =
      it.es.roles && it.es.roles.length > 0
        ? it.es.roles
        : [{ rol: it.es.rol, tipo: "", periodo: it.es.periodo, detalle: it.es.detalle }];

    const max = Math.max(rolesEn.length, rolesEs.length);
    const rolesBorrador: BorradorRol[] = Array.from({ length: max }, (_, i) => {
      const rEn = rolesEn[i];
      const rEs = rolesEs[i];
      const base = rEs ?? rEn;
      return {
        rolEn: rEn?.rol ?? "",
        rolEs: rEs?.rol ?? "",
        ubicacionEn: rEn?.ubicacion ?? "",
        ubicacionEs: rEs?.ubicacion ?? "",
        modalidad: (base?.modalidad ?? "") as TipoUbicacion,
        tipoEmpleo: (base?.tipoEmpleo ?? "") as TipoEmpleo,
        actual: Boolean(base?.actual),
        mesInicio: base?.mesInicio ?? "",
        anioInicio: base?.anioInicio ?? "",
        mesFin: base?.mesFin ?? "",
        anioFin: base?.anioFin ?? "",
        periodoFallbackEn: rEn?.periodo ?? "",
        periodoFallbackEs: rEs?.periodo ?? "",
        detalleEn: (rEn?.detalle ?? []).join("\n"),
        detalleEs: (rEs?.detalle ?? []).join("\n"),
      };
    });

    setB({
      empresa: it.empresa,
      logo: it.logo,
      periodoTotalEn: it.en.periodoTotal ?? "",
      periodoTotalEs: it.es.periodoTotal ?? "",
      roles: rolesBorrador,
    });
    setAbierto(true);
  };

  const agregarRol = () => {
    setB((prev) => {
      const referencia = prev.roles[0] ?? ROL_VACIO;
      const nuevoAscenso: BorradorRol = {
        ...ROL_VACIO,
        ubicacionEn: referencia.ubicacionEn,
        ubicacionEs: referencia.ubicacionEs,
        modalidad: referencia.modalidad,
        tipoEmpleo: referencia.tipoEmpleo,
      };
      return {
        ...prev,
        roles: [nuevoAscenso, ...prev.roles],
      };
    });
  };

  const quitarRol = (idx: number) => {
    if (b.roles.length <= 1) return;
    setB((prev) => ({ ...prev, roles: prev.roles.filter((_, i) => i !== idx) }));
  };

  const actualizarRol = <K extends keyof BorradorRol>(idx: number, campo: K, valor: BorradorRol[K]) => {
    setB((prev) => ({
      ...prev,
      roles: prev.roles.map((r, i) => (i === idx ? { ...r, [campo]: valor } : r)),
    }));
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const empresa = b.empresa.trim();
    if (empresa.length < 2) {
      setMensaje("Escribe el nombre de la empresa / organización.");
      return;
    }

    const rolesEn: RolExperiencia[] = b.roles.map((r) => {
      const periodoCalc = formatearPeriodoLinkedin(
        {
          mesInicio: r.mesInicio,
          anioInicio: r.anioInicio,
          mesFin: r.mesFin,
          anioFin: r.anioFin,
          actual: r.actual,
          periodoFallback: r.periodoFallbackEn || r.periodoFallbackEs,
        },
        "en",
      );
      const tipoLabel = etiquetaTipoEmpleo(r.tipoEmpleo, "en");
      const obj: RolExperiencia = {
        rol: r.rolEn.trim() || r.rolEs.trim(),
        periodo: periodoCalc,
        detalle: lineas(r.detalleEn).length ? lineas(r.detalleEn) : lineas(r.detalleEs),
        ...(tipoLabel ? { tipo: tipoLabel } : {}),
        ...(r.ubicacionEn.trim() || r.ubicacionEs.trim()
          ? { ubicacion: r.ubicacionEn.trim() || r.ubicacionEs.trim() }
          : {}),
        ...(r.modalidad ? { modalidad: r.modalidad } : {}),
        ...(r.tipoEmpleo ? { tipoEmpleo: r.tipoEmpleo } : {}),
        actual: r.actual,
        ...(r.mesInicio ? { mesInicio: r.mesInicio } : {}),
        ...(r.anioInicio ? { anioInicio: r.anioInicio } : {}),
        ...(!r.actual && r.mesFin ? { mesFin: r.mesFin } : {}),
        ...(!r.actual && r.anioFin ? { anioFin: r.anioFin } : {}),
      };
      return obj;
    });

    const rolesEs: RolExperiencia[] = b.roles.map((r) => {
      const periodoCalc = formatearPeriodoLinkedin(
        {
          mesInicio: r.mesInicio,
          anioInicio: r.anioInicio,
          mesFin: r.mesFin,
          anioFin: r.anioFin,
          actual: r.actual,
          periodoFallback: r.periodoFallbackEs || r.periodoFallbackEn,
        },
        "es",
      );
      const tipoLabel = etiquetaTipoEmpleo(r.tipoEmpleo, "es");
      const obj: RolExperiencia = {
        rol: r.rolEs.trim() || r.rolEn.trim(),
        periodo: periodoCalc,
        detalle: lineas(r.detalleEs).length ? lineas(r.detalleEs) : lineas(r.detalleEn),
        ...(tipoLabel ? { tipo: tipoLabel } : {}),
        ...(r.ubicacionEs.trim() || r.ubicacionEn.trim()
          ? { ubicacion: r.ubicacionEs.trim() || r.ubicacionEn.trim() }
          : {}),
        ...(r.modalidad ? { modalidad: r.modalidad } : {}),
        ...(r.tipoEmpleo ? { tipoEmpleo: r.tipoEmpleo } : {}),
        actual: r.actual,
        ...(r.mesInicio ? { mesInicio: r.mesInicio } : {}),
        ...(r.anioInicio ? { anioInicio: r.anioInicio } : {}),
        ...(!r.actual && r.mesFin ? { mesFin: r.mesFin } : {}),
        ...(!r.actual && r.anioFin ? { anioFin: r.anioFin } : {}),
      };
      return obj;
    });

    const primeroEn: RolExperiencia = rolesEn[0] ?? { rol: "", periodo: "", detalle: [] };
    const primeroEs: RolExperiencia = rolesEs[0] ?? { rol: "", periodo: "", detalle: [] };
    const tieneVarios = rolesEn.length > 1;

    const nuevo: ExperienciaItem = {
      id: editando ?? `exp-${Date.now()}`,
      empresa,
      logo: b.logo,
      en: {
        periodo: b.periodoTotalEn.trim() || primeroEn.periodo,
        rol: primeroEn.rol,
        detalle: primeroEn.detalle,
        ...(b.periodoTotalEn.trim() ? { periodoTotal: b.periodoTotalEn.trim() } : {}),
        ...(tieneVarios ? { roles: rolesEn } : {}),
      },
      es: {
        periodo: b.periodoTotalEs.trim() || primeroEs.periodo,
        rol: primeroEs.rol,
        detalle: primeroEs.detalle,
        ...(b.periodoTotalEs.trim() ? { periodoTotal: b.periodoTotalEs.trim() } : {}),
        ...(tieneVarios ? { roles: rolesEs } : {}),
      },
    };

    const siguiente = editando === null ? [nuevo, ...lista] : lista.map((x) => (x.id === editando ? nuevo : x));
    if (await guardar(siguiente)) {
      setAbierto(false);
      setEditando(null);
    }
  };

  const borrar = async (it: ExperienciaItem) => {
    if (!window.confirm(`¿Eliminar "${it.empresa}"?`)) return;
    await eliminarExperienciaRemota(it.id);
    const filtrada = lista.filter((x) => x.id !== it.id);
    guardarExperienciaLocal(filtrada);
    setLista(filtrada);
    setMensaje("Experiencia eliminada.");
  };

  const restablecer = async () => {
    if (!window.confirm("¿Restablecer experiencia original?")) return;
    const base = await restablecerExperienciaRemota();
    setLista(base);
    setMensaje("Experiencia restablecida.");
  };

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-2xl font-bold">Experiencia</h2>
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
            <h3 className="font-bold">
              {editando === null ? "Add a role / Agregar experiencia" : "Editar experiencia"}
            </h3>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Organization / Empresa *</label>
              <input
                className={CAMPO}
                placeholder="Ej: AXUS ADVISORY GROUP"
                value={b.empresa}
                maxLength={120}
                onChange={(e) => setB({ ...b, empresa: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Logo (PNG o JPG)</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => cargarLogoExp(e.target.files?.[0])}
                className="w-full text-sm"
              />
              {b.logo && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={b.logo}
                    alt="Logo"
                    className="h-12 w-12 rounded-md border border-border bg-white object-contain p-1"
                  />
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
          </div>

          {b.roles.length > 1 && (
            <div className="grid gap-4 rounded-lg border border-ojos/30 bg-secondary/40 p-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ojos">
                  Duración total en empresa (Inglés - opcional)
                </label>
                <input
                  className={CAMPO}
                  placeholder="Ej: 2 yrs 6 mos"
                  value={b.periodoTotalEn}
                  onChange={(e) => setB({ ...b, periodoTotalEn: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ojos">
                  Duración total en empresa (Español - opcional)
                </label>
                <input
                  className={CAMPO}
                  placeholder="Ej: 2 años 6 meses"
                  value={b.periodoTotalEs}
                  onChange={(e) => setB({ ...b, periodoTotalEs: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">
                Puestos / Roles ({b.roles.length}) {b.roles.length > 1 ? "— Línea de tiempo anidada" : ""}
              </p>
              <button type="button" onClick={agregarRol} className={`${BOTON} border border-ojos/50 text-ojos`}>
                <Plus className="h-4 w-4" />
                Agregar puesto / ascenso
              </button>
            </div>

            {b.roles.map((r, idx) => (
              <div key={idx} className="space-y-4 rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ojos">
                    Puesto #{idx + 1} {idx === 0 ? "(Más reciente / Arriba)" : "(Anterior / Abajo)"}
                  </span>
                  {b.roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => quitarRol(idx)}
                      className="inline-flex items-center gap-1 text-xs text-sharingan hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar puesto
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Job title * (EN)</label>
                    <input
                      className={CAMPO}
                      placeholder="Example: Senior Product Manager"
                      value={r.rolEn}
                      onChange={(e) => actualizarRol(idx, "rolEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Cargo / Puesto * (ES)</label>
                    <input
                      className={CAMPO}
                      placeholder="Ej: Ingeniero Cyber-SOC Nivel 1"
                      value={r.rolEs}
                      onChange={(e) => actualizarRol(idx, "rolEs", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Location / Ubicación (ES)</label>
                    <input
                      className={CAMPO}
                      placeholder="Ciudad o región (Ej: Lima, Perú)"
                      value={r.ubicacionEs}
                      onChange={(e) => actualizarRol(idx, "ubicacionEs", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Location (EN)</label>
                    <input
                      className={CAMPO}
                      placeholder="City or region (Ej: Lima, Peru)"
                      value={r.ubicacionEn}
                      onChange={(e) => actualizarRol(idx, "ubicacionEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Location type / Modalidad</label>
                    <select
                      className={CAMPO}
                      value={r.modalidad}
                      onChange={(e) => actualizarRol(idx, "modalidad", e.target.value as TipoUbicacion)}
                    >
                      {MODALIDAD_OPCIONES.map((op) => (
                        <option key={op.value || "empty"} value={op.value}>
                          {op.es} ({op.en})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold">Employment type / Tipo de jornada</label>
                  <select
                    className={CAMPO}
                    value={r.tipoEmpleo}
                    onChange={(e) => actualizarRol(idx, "tipoEmpleo", e.target.value as TipoEmpleo)}
                  >
                    {TIPO_EMPLEO_OPCIONES.map((op) => (
                      <option key={op.value || "empty"} value={op.value}>
                        {op.es} ({op.en})
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={r.actual}
                    onChange={(e) => actualizarRol(idx, "actual", e.target.checked)}
                    className="h-4 w-4 accent-ojos"
                  />
                  I currently work here / Trabajo aquí actualmente
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Start month / Mes de inicio</label>
                    <select
                      className={CAMPO}
                      value={r.mesInicio}
                      onChange={(e) => actualizarRol(idx, "mesInicio", e.target.value)}
                    >
                      {MESES_OPCIONES.map((m) => (
                        <option key={m.value || "empty"} value={m.value}>
                          {m.es} — {m.en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Start year * / Año de inicio</label>
                    <select
                      className={CAMPO}
                      value={r.anioInicio}
                      onChange={(e) => actualizarRol(idx, "anioInicio", e.target.value)}
                    >
                      <option value="">Año / Year</option>
                      {ANIOS_OPCIONES.map((anio) => (
                        <option key={anio} value={anio}>
                          {anio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!r.actual && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold">End month / Mes de fin</label>
                      <select
                        className={CAMPO}
                        value={r.mesFin}
                        onChange={(e) => actualizarRol(idx, "mesFin", e.target.value)}
                      >
                        {MESES_OPCIONES.map((m) => (
                          <option key={m.value || "empty"} value={m.value}>
                            {m.es} — {m.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold">End year / Año de fin</label>
                      <select
                        className={CAMPO}
                        value={r.anioFin}
                        onChange={(e) => actualizarRol(idx, "anioFin", e.target.value)}
                      >
                        <option value="">Año / Year</option>
                        {ANIOS_OPCIONES.map((anio) => (
                          <option key={anio} value={anio}>
                            {anio}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">
                      Highlights (EN — one per line)
                    </label>
                    <textarea
                      className={CAMPO}
                      rows={4}
                      placeholder="Projects, problems you solved, or results you achieved"
                      value={r.detalleEn}
                      onChange={(e) => actualizarRol(idx, "detalleEn", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">
                      Logros / Funciones (ES — uno por línea)
                    </label>
                    <textarea
                      className={CAMPO}
                      rows={4}
                      placeholder="Proyectos, problemas resueltos o resultados logrados"
                      value={r.detalleEs}
                      onChange={(e) => actualizarRol(idx, "detalleEs", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className={`${BOTON} w-full bg-sharingan text-foreground sm:w-auto`}>
            <Save className="h-4 w-4" />
            Save / Guardar
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {lista.map((it) => {
          const cantRoles = it.es.roles?.length ?? 1;
          return (
            <li key={it.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3">
              {it.logo && (
                <img
                  src={it.logo}
                  alt="Logo"
                  className="h-10 w-10 shrink-0 rounded-md border border-border bg-white object-contain p-0.5"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold wrap-anywhere">
                  {it.empresa}
                  {cantRoles > 1 && (
                    <span className="ml-2 rounded bg-ojos/15 px-2 py-0.5 text-xs font-medium text-ojos">
                      {cantRoles} puestos
                    </span>
                  )}
                </p>
                <p className="font-mono text-xs text-muted-foreground wrap-anywhere">
                  {it.es.rol || it.en.rol} · {it.es.periodoTotal || it.es.periodo || it.en.periodo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirEditar(it)}
                aria-label="Editar"
                className="rounded-md border border-border p-2 hover:text-ojos"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => borrar(it)}
                aria-label="Eliminar"
                className="rounded-md border border-border p-2 hover:text-sharingan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}