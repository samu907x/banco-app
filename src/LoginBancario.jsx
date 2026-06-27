import React, { useState } from "react";

/**
 * Módulo de inicio de sesión y registro para app bancaria de personas mayores.
 *
 * Incluye dos pantallas:
 *  1. Iniciar sesión: número de cuenta + PIN de 4 dígitos.
 *  2. Crear cuenta: formulario con datos personales para registrarse.
 *
 * Cómo usarlo:
 *   import LoginBancario from "./LoginBancario";
 *
 *   <LoginBancario
 *     onIniciarSesion={(numeroCuenta, pin) => { ... tu lógica de autenticación ... }}
 *     onCrearCuenta={(datos) => { ... tu lógica de registro ... }}
 *   />
 *
 * Props:
 *   - onIniciarSesion(numeroCuenta: string, pin: string): se llama cuando el usuario
 *     completa el número de cuenta y el PIN y presiona "Entrar". Debes validar
 *     contra tu backend y, si es correcto, navegar a la app (por ejemplo,
 *     mostrando tu componente AppBancariaMayores).
 *   - onCrearCuenta(datos: object): se llama al enviar el formulario de registro.
 *     El objeto datos trae: { nombre, apellido, numeroDocumento, telefono,
 *     correo, numeroCuentaNueva, pinNuevo }.
 *
 * Ambas props son opcionales: si no las pasas, el componente solo muestra
 * mensajes de ejemplo en consola, para que puedas probarlo de inmediato.
 */

const COLORS = {
  fondo: "#FAF6EF",
  azul: "#1B3A5C",
  azulClaro: "#C9D6E3",
  verde: "#2D7D4F",
  rojo: "#B0413E",
  dorado: "#C68A2E",
  blanco: "#FFFFFF",
  textoSecundario: "#6B6A64",
  borde: "#D8D2C0",
};

function soloNumeros(valor) {
  return valor.replace(/[^0-9]/g, "");
}

// ---------- Teclado numérico grande para el PIN ----------

function TecladoPin({ pin, onCambiar, longitud = 4 }) {
  function presionar(num) {
    if (pin.length < longitud) {
      onCambiar(pin + num);
    }
  }
  function borrar() {
    onCambiar(pin.slice(0, -1));
  }

  const teclas = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div>
      <div style={estilos.puntosPin}>
        {Array.from({ length: longitud }).map((_, i) => (
          <span
            key={i}
            style={{
              ...estilos.puntoPin,
              background: i < pin.length ? COLORS.azul : COLORS.blanco,
            }}
          />
        ))}
      </div>
      <div style={estilos.gridTeclado}>
        {teclas.map((t) => (
          <button key={t} type="button" onClick={() => presionar(t)} style={estilos.teclaPin}>
            {t}
          </button>
        ))}
        <button type="button" onClick={borrar} style={{ ...estilos.teclaPin, fontSize: 18 }} aria-label="Borrar">
          ⌫
        </button>
        <button type="button" onClick={() => presionar("0")} style={estilos.teclaPin}>
          0
        </button>
        <span />
      </div>
    </div>
  );
}

// ---------- Pantalla: iniciar sesión ----------

function PantallaIniciarSesion({ numeroCuenta, pin, onCambiarCuenta, onCambiarPin, onEntrar, onIrCrearCuenta, error }) {
  const listo = numeroCuenta.length >= 4 && pin.length === 4;

  return (
    <div style={estilos.contenido}>
      <div style={estilos.logoCirculo}>🏦</div>
      <p style={estilos.tituloLogin}>Bienvenido</p>
      <p style={estilos.subtituloLogin}>Ingrese a su cuenta</p>

      <label style={estilos.etiqueta} htmlFor="numero-cuenta">
        Número de cuenta
      </label>
      <input
        id="numero-cuenta"
        type="text"
        inputMode="numeric"
        placeholder="Ej: 1234567890"
        value={numeroCuenta}
        onChange={(e) => onCambiarCuenta(soloNumeros(e.target.value))}
        style={estilos.inputCuenta}
        autoComplete="off"
      />

      <p style={{ ...estilos.etiqueta, marginTop: 24, textAlign: "center" }}>Ingrese su clave de 4 dígitos</p>
      <TecladoPin pin={pin} onCambiar={onCambiarPin} />

      {error && <p style={estilos.textoError}>{error}</p>}

      <button
        type="button"
        onClick={onEntrar}
        disabled={!listo}
        style={{
          ...estilos.botonPrincipal,
          opacity: listo ? 1 : 0.5,
          cursor: listo ? "pointer" : "default",
        }}
      >
        Entrar
      </button>

      <button type="button" onClick={onIrCrearCuenta} style={estilos.botonSecundario}>
        Crear una cuenta nueva
      </button>
    </div>
  );
}

// ---------- Pantalla: crear cuenta ----------

function CampoTexto({ etiqueta, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={estilos.etiqueta}>{etiqueta}</label>
      <input style={estilos.inputTexto} {...props} />
    </div>
  );
}

function PantallaCrearCuenta({ onVolver, onEnviar }) {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    numeroDocumento: "",
    telefono: "",
    correo: "",
    pinNuevo: "",
    pinConfirmar: "",
  });
  const [error, setError] = useState("");

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }

  function validarYEnviar() {
    if (!datos.nombre || !datos.apellido || !datos.numeroDocumento || !datos.telefono) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }
    if (datos.pinNuevo.length !== 4) {
      setError("La clave debe tener 4 dígitos.");
      return;
    }
    if (datos.pinNuevo !== datos.pinConfirmar) {
      setError("Las dos claves no coinciden. Vuelva a escribirlas.");
      return;
    }
    setError("");
    onEnviar({
      nombre: datos.nombre,
      apellido: datos.apellido,
      numeroDocumento: datos.numeroDocumento,
      telefono: datos.telefono,
      correo: datos.correo,
      pinNuevo: datos.pinNuevo,
    });
  }

  return (
    <div style={estilos.contenido}>
      <div style={estilos.topbar}>
        <button onClick={onVolver} aria-label="Volver" style={estilos.botonVolver} type="button">
          ←
        </button>
        <p style={estilos.tituloTopbar}>Crear cuenta nueva</p>
      </div>

      <p style={{ ...estilos.textoNormal, marginTop: 18 }}>
        Complete sus datos personales para abrir su cuenta.
      </p>

      <CampoTexto
        etiqueta="Nombres"
        placeholder="Ej: Rosa María"
        value={datos.nombre}
        onChange={(e) => actualizar("nombre", e.target.value)}
      />
      <CampoTexto
        etiqueta="Apellidos"
        placeholder="Ej: Martínez Gómez"
        value={datos.apellido}
        onChange={(e) => actualizar("apellido", e.target.value)}
      />
      <CampoTexto
        etiqueta="Número de documento (cédula)"
        placeholder="Ej: 12345678"
        inputMode="numeric"
        value={datos.numeroDocumento}
        onChange={(e) => actualizar("numeroDocumento", soloNumeros(e.target.value))}
      />
      <CampoTexto
        etiqueta="Número de teléfono"
        placeholder="Ej: 3001234567"
        inputMode="numeric"
        value={datos.telefono}
        onChange={(e) => actualizar("telefono", soloNumeros(e.target.value))}
      />
      <CampoTexto
        etiqueta="Correo electrónico (opcional)"
        placeholder="Ej: rosa@correo.com"
        type="email"
        value={datos.correo}
        onChange={(e) => actualizar("correo", e.target.value)}
      />

      <p style={{ ...estilos.textoNormal, marginTop: 10 }}>Cree una clave de 4 dígitos para su cuenta:</p>
      <CampoTexto
        etiqueta="Nueva clave (4 dígitos)"
        placeholder="••••"
        inputMode="numeric"
        maxLength={4}
        value={datos.pinNuevo}
        onChange={(e) => actualizar("pinNuevo", soloNumeros(e.target.value).slice(0, 4))}
      />
      <CampoTexto
        etiqueta="Confirme la clave"
        placeholder="••••"
        inputMode="numeric"
        maxLength={4}
        value={datos.pinConfirmar}
        onChange={(e) => actualizar("pinConfirmar", soloNumeros(e.target.value).slice(0, 4))}
      />

      {error && <p style={estilos.textoError}>{error}</p>}

      <button type="button" onClick={validarYEnviar} style={estilos.botonPrincipal}>
        Crear mi cuenta
      </button>
      <button type="button" onClick={onVolver} style={estilos.botonSecundario}>
        Ya tengo cuenta, volver
      </button>
    </div>
  );
}

// ---------- Pantalla: cuenta creada con éxito ----------

function PantallaCuentaCreada({ numeroCuenta, onIrLogin }) {
  return (
    <div style={{ ...estilos.contenido, textAlign: "center", padding: "50px 24px" }}>
      <div style={estilos.iconoExito}>✓</div>
      <p style={estilos.tituloExito}>Cuenta creada</p>
      <p style={estilos.textoNormal}>Su número de cuenta es:</p>
      <p style={estilos.numeroCuentaGrande}>{numeroCuenta}</p>
      <p style={{ ...estilos.textoSecundario2, marginTop: 8 }}>
        Guarde este número, lo necesitará para entrar.
      </p>
      <button type="button" onClick={onIrLogin} style={{ ...estilos.botonPrincipal, marginTop: 24 }}>
        Ir a iniciar sesión
      </button>
    </div>
  );
}

// ---------- Componente principal ----------

export default function LoginBancario({ onIniciarSesion, onCrearCuenta }) {
  const [pantalla, setPantalla] = useState("login"); // login | crear | creada
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [cuentaNuevaCreada, setCuentaNuevaCreada] = useState("");

  function manejarEntrar() {
    setError("");
    // TODO: reemplazar esta validación de ejemplo por la llamada real a tu API
    // de autenticación. Aquí solo se verifica que ambos campos estén completos.
    if (numeroCuenta.length < 4 || pin.length !== 4) {
      setError("Verifique el número de cuenta y la clave.");
      return;
    }
    if (onIniciarSesion) {
      onIniciarSesion(numeroCuenta, pin);
    } else {
      // eslint-disable-next-line no-console
      console.log("Iniciar sesión con:", { numeroCuenta, pin });
    }
  }

  function manejarCrearCuenta(datos) {
    // TODO: reemplazar por la llamada real a tu API de registro.
    // Aquí se genera un número de cuenta de ejemplo de forma local.
    const numeroGenerado = String(Math.floor(1000000000 + Math.random() * 9000000000));

    if (onCrearCuenta) {
      onCrearCuenta({ ...datos, numeroCuentaNueva: numeroGenerado });
    } else {
      // eslint-disable-next-line no-console
      console.log("Crear cuenta con:", { ...datos, numeroCuentaNueva: numeroGenerado });
    }

    setCuentaNuevaCreada(numeroGenerado);
    setPantalla("creada");
  }

  return (
    <div style={estilos.contenedorApp}>
      {pantalla === "login" && (
        <PantallaIniciarSesion
          numeroCuenta={numeroCuenta}
          pin={pin}
          onCambiarCuenta={setNumeroCuenta}
          onCambiarPin={setPin}
          onEntrar={manejarEntrar}
          onIrCrearCuenta={() => {
            setError("");
            setPantalla("crear");
          }}
          error={error}
        />
      )}

      {pantalla === "crear" && (
        <PantallaCrearCuenta onVolver={() => setPantalla("login")} onEnviar={manejarCrearCuenta} />
      )}

      {pantalla === "creada" && (
        <PantallaCuentaCreada
          numeroCuenta={cuentaNuevaCreada}
          onIrLogin={() => {
            setNumeroCuenta(cuentaNuevaCreada);
            setPin("");
            setPantalla("login");
          }}
        />
      )}
    </div>
  );
}

// ---------- Estilos ----------

const estilos = {
  contenedorApp: {
    maxWidth: 420,
    margin: "0 auto",
    background: COLORS.fondo,
    borderRadius: 20,
    border: `1px solid ${COLORS.borde}`,
    overflow: "hidden",
    fontFamily: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
  contenido: { padding: 24 },
  topbar: {
    background: COLORS.azul,
    color: COLORS.blanco,
    padding: "16px",
    margin: "-24px -24px 0",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  botonVolver: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: COLORS.blanco,
    width: 44,
    height: 44,
    borderRadius: "50%",
    fontSize: 22,
    cursor: "pointer",
  },
  tituloTopbar: { fontSize: 21, fontWeight: 700, margin: 0 },
  logoCirculo: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: COLORS.azul,
    color: COLORS.blanco,
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  tituloLogin: { fontSize: 26, fontWeight: 700, color: COLORS.azul, textAlign: "center", margin: 0 },
  subtituloLogin: {
    fontSize: 18,
    color: COLORS.textoSecundario,
    textAlign: "center",
    margin: "6px 0 28px",
  },
  etiqueta: { display: "block", fontSize: 17, fontWeight: 700, color: COLORS.azul, marginBottom: 8 },
  inputCuenta: {
    width: "100%",
    fontSize: 24,
    textAlign: "center",
    padding: 16,
    border: `2px solid ${COLORS.azul}`,
    borderRadius: 12,
    color: COLORS.azul,
    fontWeight: 700,
    boxSizing: "border-box",
    letterSpacing: 1,
  },
  inputTexto: {
    width: "100%",
    fontSize: 18,
    padding: "14px 16px",
    border: `2px solid ${COLORS.borde}`,
    borderRadius: 12,
    color: "#3D3D3A",
    boxSizing: "border-box",
  },
  puntosPin: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    margin: "14px 0 18px",
  },
  puntoPin: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: `2px solid ${COLORS.azul}`,
    display: "inline-block",
  },
  gridTeclado: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    maxWidth: 280,
    margin: "0 auto",
  },
  teclaPin: {
    background: COLORS.blanco,
    border: `2px solid ${COLORS.borde}`,
    color: COLORS.azul,
    fontSize: 24,
    fontWeight: 700,
    padding: "16px 0",
    borderRadius: 12,
    cursor: "pointer",
  },
  textoNormal: { fontSize: 18, color: "#3D3D3A", margin: "0 0 14px" },
  textoSecundario2: { fontSize: 15, color: COLORS.textoSecundario },
  textoError: {
    fontSize: 16,
    color: COLORS.rojo,
    textAlign: "center",
    margin: "16px 0 0",
    fontWeight: 700,
  },
  botonPrincipal: {
    marginTop: 24,
    width: "100%",
    background: COLORS.verde,
    color: COLORS.blanco,
    fontSize: 20,
    fontWeight: 700,
    padding: 18,
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
  },
  botonSecundario: {
    marginTop: 12,
    width: "100%",
    background: "none",
    color: COLORS.azul,
    fontSize: 18,
    fontWeight: 700,
    padding: 16,
    border: `2px solid ${COLORS.azul}`,
    borderRadius: 14,
    cursor: "pointer",
  },
  iconoExito: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: COLORS.verde,
    color: COLORS.blanco,
    fontSize: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  tituloExito: { fontSize: 24, fontWeight: 700, color: COLORS.azul, margin: "0 0 16px" },
  numeroCuentaGrande: {
    fontSize: 30,
    fontWeight: 700,
    color: COLORS.azul,
    letterSpacing: 1,
    margin: "8px 0 0",
  },
}