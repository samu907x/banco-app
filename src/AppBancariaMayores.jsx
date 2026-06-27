import React, { useState } from "react";

/**
 * App bancaria interactiva pensada para personas de la tercera edad.
 *
 * Principios de diseño aplicados:
 * - Texto grande y alto contraste en toda la interfaz.
 * - Un objetivo por pantalla (sin menús anidados ni pasos ocultos).
 * - Botones grandes (mínimo 60px de alto) fáciles de tocar.
 * - Confirmación explícita antes de cualquier acción que mueva dinero.
 * - Botón de "Ayuda" siempre visible.
 * - Lectura en voz alta de la información clave (saldo, número de cuenta, ayuda),
 *   usando la Web Speech API del navegador (SpeechSynthesisUtterance).
 *
 * Cómo usarlo:
 *   import AppBancariaMayores from "./AppBancariaMayores";
 *   <AppBancariaMayores />
 *
 * No requiere props. Los datos (saldo, contactos, movimientos) son de ejemplo;
 * reemplázalos por los datos reales de tu backend donde se indica con TODO.
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

// TODO: reemplazar por datos reales desde tu API / estado global.
const DATOS_EJEMPLO = {
  nombreUsuario: "Rosa Martínez",
  saldo: 1245300,
  numeroCuenta: "1234 5678 9012",
  contactos: [
    { id: "ana", nombre: "Mi hija Ana", inicial: "A" },
    { id: "tomas", nombre: "Mi nieto Tomás", inicial: "T" },
  ],
  movimientos: [
    { id: 1, titulo: "Envío a Mi hija Ana", fecha: "24 de junio", monto: -50000 },
    { id: 2, titulo: "Depósito recibido", fecha: "20 de junio", monto: 300000 },
    { id: 3, titulo: "Pago de servicios", fecha: "15 de junio", monto: -85000 },
  ],
  telefonoAyuda: "01 8000 123 456",
};

function formatoMoneda(valor) {
  const signo = valor < 0 ? "-" : "";
  return `${signo}$${Math.abs(valor).toLocaleString("es-CO")}`;
}

function hablar(texto) {
  try {
    if (!("speechSynthesis" in window)) return;
    const u = new window.SpeechSynthesisUtterance(texto);
    u.lang = "es-ES";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    // Si el navegador no soporta lectura en voz alta, simplemente no hace nada.
  }
}

// ---------- Componentes pequeños reutilizables ----------

function BarraSuperior({ titulo, onVolver }) {
  return (
    <div style={estilos.topbar}>
      <button
        onClick={onVolver}
        aria-label="Volver"
        style={estilos.botonVolver}
      >
        ←
      </button>
      <p style={estilos.tituloTopbar}>{titulo}</p>
    </div>
  );
}

function BotonMenu({ color, icono, texto, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ ...estilos.botonMenu, borderColor: color, color }}
    >
      <span style={{ fontSize: 30 }} aria-hidden="true">{icono}</span>
      <span>{texto}</span>
    </button>
  );
}

function BotonContacto({ inicial, nombre, onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} style={estilos.botonContacto}>
      <span style={estilos.avatar}>{inicial}</span>
      <span>{nombre}</span>
    </Comp>
  );
}

function FilaMovimiento({ titulo, fecha, monto }) {
  const color = monto < 0 ? COLORS.rojo : COLORS.verde;
  return (
    <div style={{ ...estilos.filaMovimiento, borderLeftColor: color }}>
      <div>
        <p style={estilos.movTitulo}>{titulo}</p>
        <p style={estilos.movFecha}>{fecha}</p>
      </div>
      <p style={{ ...estilos.movMonto, color }}>{formatoMoneda(monto)}</p>
    </div>
  );
}

// ---------- Pantallas ----------

function PantallaInicio({ datos, onIr }) {
  return (
    <>
      <div style={estilos.headerInicio}>
        <div>
          <p style={estilos.saludo}>Hola,</p>
          <p style={estilos.nombreUsuario}>{datos.nombreUsuario}</p>
        </div>
        <button
          onClick={() => onIr("ayuda")}
          aria-label="Ayuda"
          style={estilos.botonAyuda}
        >
          ?
        </button>
      </div>

      <div style={estilos.contenido}>
        <div style={estilos.tarjetaSaldo}>
          <p style={{ margin: 0, fontSize: 18, color: "#3D3D3A" }}>Su saldo disponible</p>
          <p style={estilos.saldoNumero}>{formatoMoneda(datos.saldo)}</p>
          <button
            onClick={() =>
              hablar(`Su saldo disponible es ${datos.saldo.toLocaleString("es-CO")} pesos`)
            }
            style={estilos.botonEscuchar}
          >
            🔊 Escuchar saldo
          </button>
        </div>

        <p style={estilos.subtitulo}>¿Qué desea hacer?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BotonMenu color={COLORS.azul} icono="💸" texto="Enviar dinero" onClick={() => onIr("transferir")} />
          <BotonMenu color={COLORS.verde} icono="💰" texto="Recibir / Depositar" onClick={() => onIr("depositar")} />
          <BotonMenu color={COLORS.dorado} icono="📋" texto="Ver mis movimientos" onClick={() => onIr("movimientos")} />
          <BotonMenu color={COLORS.azul} icono="👤" texto="Mis contactos guardados" onClick={() => onIr("contactos")} />
        </div>
      </div>
    </>
  );
}

function PantallaTransferir({ datos, contacto, monto, onElegirContacto, onCambiarMonto, onContinuar, onVolver }) {
  return (
    <>
      <BarraSuperior titulo="Enviar dinero" onVolver={onVolver} />
      <div style={estilos.contenido}>
        <p style={estilos.textoNormal}>Elija a quién enviar:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {datos.contactos.map((c) => (
            <BotonContacto
              key={c.id}
              inicial={c.inicial}
              nombre={c.nombre}
              onClick={() => onElegirContacto(c.nombre)}
            />
          ))}
          <BotonContacto inicial="+" nombre="Otra persona" onClick={() => onElegirContacto("Otra persona")} />
        </div>

        {contacto && (
          <div style={{ marginTop: 24 }}>
            <p style={estilos.textoNormal}>
              ¿Cuánto desea enviar a <strong>{contacto}</strong>?
            </p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={monto ? monto.toLocaleString("es-CO") : ""}
              onChange={(e) => {
                const limpio = e.target.value.replace(/[^0-9]/g, "");
                onCambiarMonto(limpio ? parseInt(limpio, 10) : 0);
              }}
              style={estilos.inputMonto}
              aria-label="Monto a enviar"
            />
            <div style={estilos.gridMontos}>
              {[20000, 50000, 100000].map((v) => (
                <button key={v} onClick={() => onCambiarMonto(v)} style={estilos.botonMontoRapido}>
                  {formatoMoneda(v)}
                </button>
              ))}
            </div>
            <button onClick={onContinuar} style={estilos.botonPrincipal}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function PantallaConfirmar({ contacto, monto, onConfirmar, onCancelar }) {
  return (
    <>
      <BarraSuperior titulo="Confirmar envío" onVolver={onCancelar} />
      <div style={estilos.contenido}>
        <div style={estilos.tarjetaConfirmar}>
          <p style={estilos.textoNormal}>Va a enviar</p>
          <p style={estilos.montoConfirmar}>{formatoMoneda(monto)}</p>
          <p style={estilos.textoNormal}>a</p>
          <p style={estilos.contactoConfirmar}>{contacto}</p>
        </div>
        <p style={estilos.avisoConfirmar}>
          Revise que los datos sean correctos antes de continuar.
        </p>
        <button onClick={onConfirmar} style={{ ...estilos.botonPrincipal, marginBottom: 12 }}>
          Sí, enviar dinero
        </button>
        <button onClick={onCancelar} style={estilos.botonSecundario}>
          Cancelar
        </button>
      </div>
    </>
  );
}

function PantallaExito({ contacto, monto, onVolverInicio }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={estilos.iconoExito}>✓</div>
      <p style={estilos.tituloExito}>Envío realizado</p>
      <p style={estilos.detalleExito}>
        Envió {formatoMoneda(monto)} a {contacto}
      </p>
      <button onClick={onVolverInicio} style={estilos.botonPrincipalAzul}>
        Volver al inicio
      </button>
    </div>
  );
}

function PantallaDepositar({ numeroCuenta, onVolver }) {
  return (
    <>
      <BarraSuperior titulo="Recibir dinero" onVolver={onVolver} />
      <div style={{ ...estilos.contenido, textAlign: "center" }}>
        <p style={estilos.textoNormal}>
          Para que le envíen dinero, comparta este número de cuenta:
        </p>
        <div style={estilos.tarjetaCuenta}>
          <p style={estilos.numeroCuenta}>{numeroCuenta}</p>
        </div>
        <button
          onClick={() =>
            hablar(`Su número de cuenta es ${numeroCuenta.split("").join(" ")}`)
          }
          style={estilos.botonEscuchar}
        >
          🔊 Escuchar número
        </button>
      </div>
    </>
  );
}

function PantallaMovimientos({ movimientos, onVolver }) {
  return (
    <>
      <BarraSuperior titulo="Mis movimientos" onVolver={onVolver} />
      <div style={{ ...estilos.contenido, display: "flex", flexDirection: "column", gap: 12 }}>
        {movimientos.map((m) => (
          <FilaMovimiento key={m.id} titulo={m.titulo} fecha={m.fecha} monto={m.monto} />
        ))}
      </div>
    </>
  );
}

function PantallaContactos({ contactos, onVolver }) {
  return (
    <>
      <BarraSuperior titulo="Mis contactos" onVolver={onVolver} />
      <div style={{ ...estilos.contenido, display: "flex", flexDirection: "column", gap: 12 }}>
        {contactos.map((c) => (
          <BotonContacto key={c.id} inicial={c.inicial} nombre={c.nombre} />
        ))}
      </div>
    </>
  );
}

function PantallaAyuda({ telefonoAyuda, onVolver }) {
  return (
    <>
      <BarraSuperior titulo="Ayuda" onVolver={onVolver} />
      <div style={estilos.contenido}>
        <p style={estilos.textoNormal}>
          Esta es su app del banco. Desde la pantalla principal puede:
        </p>
        <ul style={estilos.listaAyuda}>
          <li>Ver cuánto dinero tiene</li>
          <li>Enviar dinero a alguien</li>
          <li>Compartir su número para recibir dinero</li>
          <li>Revisar sus movimientos pasados</li>
        </ul>
        <p style={{ ...estilos.textoNormal, marginTop: 18 }}>
          Si tiene dudas, llame a su banco al <strong>{telefonoAyuda}</strong>, línea gratuita.
        </p>
        <button
          onClick={() =>
            hablar(
              `Puede enviar dinero, recibir dinero, y ver sus movimientos desde la pantalla principal. Si tiene dudas llame al banco al ${telefonoAyuda}`
            )
          }
          style={{ ...estilos.botonEscuchar, width: "100%", marginTop: 10 }}
        >
          🔊 Escuchar esta ayuda
        </button>
      </div>
    </>
  );
}

// ---------- Componente principal ----------

export default function AppBancariaMayores({ datos = DATOS_EJEMPLO }) {
  const [pantalla, setPantalla] = useState("home");
  const [contacto, setContacto] = useState(null);
  const [monto, setMonto] = useState(0);

  function irA(nombre) {
    setPantalla(nombre);
  }

  function volverAInicio() {
    setContacto(null);
    setMonto(0);
    setPantalla("home");
  }

  function continuarTransferencia() {
    if (!monto || monto <= 0) {
      window.alert("Por favor ingrese un monto válido.");
      return;
    }
    setPantalla("confirmar");
  }

  function finalizarEnvio() {
    // TODO: aquí se debe llamar a la API real para procesar la transferencia.
    setPantalla("exito");
  }

  return (
    <div style={estilos.contenedorApp}>
      {pantalla === "home" && <PantallaInicio datos={datos} onIr={irA} />}

      {pantalla === "transferir" && (
        <PantallaTransferir
          datos={datos}
          contacto={contacto}
          monto={monto}
          onElegirContacto={setContacto}
          onCambiarMonto={setMonto}
          onContinuar={continuarTransferencia}
          onVolver={volverAInicio}
        />
      )}

      {pantalla === "confirmar" && (
        <PantallaConfirmar
          contacto={contacto}
          monto={monto}
          onConfirmar={finalizarEnvio}
          onCancelar={() => setPantalla("transferir")}
        />
      )}

      {pantalla === "exito" && (
        <PantallaExito contacto={contacto} monto={monto} onVolverInicio={volverAInicio} />
      )}

      {pantalla === "depositar" && (
        <PantallaDepositar numeroCuenta={datos.numeroCuenta} onVolver={volverAInicio} />
      )}

      {pantalla === "movimientos" && (
        <PantallaMovimientos movimientos={datos.movimientos} onVolver={volverAInicio} />
      )}

      {pantalla === "contactos" && (
        <PantallaContactos contactos={datos.contactos} onVolver={volverAInicio} />
      )}

      {pantalla === "ayuda" && (
        <PantallaAyuda telefonoAyuda={datos.telefonoAyuda} onVolver={volverAInicio} />
      )}
    </div>
  );
}

// ---------- Estilos ----------
// Nota: se usan objetos de estilo en línea para que el archivo funcione de forma
// autocontenida sin depender de Tailwind ni de un sistema de CSS externo.
// Si tu proyecto usa Tailwind o CSS modules, puedes migrar estos estilos
// fácilmente conservando los mismos valores (tamaños de fuente, colores, espacios).

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
  topbar: {
    background: COLORS.azul,
    color: COLORS.blanco,
    padding: "18px 16px",
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
  headerInicio: {
    background: COLORS.azul,
    color: COLORS.blanco,
    padding: "24px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saludo: { margin: 0, fontSize: 16, color: COLORS.azulClaro },
  nombreUsuario: { margin: "2px 0 0", fontSize: 24, fontWeight: 700 },
  botonAyuda: {
    background: COLORS.verde,
    border: "none",
    color: COLORS.blanco,
    width: 56,
    height: 56,
    borderRadius: "50%",
    fontSize: 24,
    fontWeight: 700,
    cursor: "pointer",
  },
  contenido: { padding: 20 },
  tarjetaSaldo: {
    background: COLORS.blanco,
    border: `2px solid ${COLORS.azul}`,
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
  },
  saldoNumero: { margin: "8px 0 0", fontSize: 40, fontWeight: 700, color: COLORS.azul },
  botonEscuchar: {
    marginTop: 10,
    background: "none",
    border: `2px solid ${COLORS.azul}`,
    color: COLORS.azul,
    fontSize: 17,
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },
  subtitulo: { fontSize: 20, fontWeight: 700, color: COLORS.azul, margin: "28px 0 14px" },
  botonMenu: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    width: "100%",
    background: COLORS.blanco,
    border: "2px solid",
    fontSize: 20,
    fontWeight: 700,
    padding: "18px 20px",
    borderRadius: 14,
    cursor: "pointer",
    textAlign: "left",
    minHeight: 64,
  },
  textoNormal: { fontSize: 19, color: "#3D3D3A", margin: "0 0 14px" },
  botonContacto: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    background: COLORS.blanco,
    border: `2px solid ${COLORS.borde}`,
    color: COLORS.azul,
    fontSize: 19,
    fontWeight: 700,
    padding: 16,
    borderRadius: 14,
    cursor: "pointer",
    textAlign: "left",
    minHeight: 60,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: COLORS.azul,
    color: COLORS.blanco,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 17,
    flexShrink: 0,
  },
  inputMonto: {
    width: "100%",
    fontSize: 30,
    textAlign: "center",
    padding: 16,
    border: `2px solid ${COLORS.azul}`,
    borderRadius: 12,
    color: COLORS.azul,
    fontWeight: 700,
    boxSizing: "border-box",
  },
  gridMontos: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginTop: 14,
  },
  botonMontoRapido: {
    background: COLORS.blanco,
    border: `2px solid ${COLORS.azul}`,
    color: COLORS.azul,
    fontSize: 16,
    fontWeight: 700,
    padding: "12px 0",
    borderRadius: 10,
    cursor: "pointer",
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
  botonPrincipalAzul: {
    width: "100%",
    background: COLORS.azul,
    color: COLORS.blanco,
    fontSize: 19,
    fontWeight: 700,
    padding: 18,
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
  },
  botonSecundario: {
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
  tarjetaConfirmar: {
    background: COLORS.blanco,
    border: `2px solid ${COLORS.dorado}`,
    borderRadius: 16,
    padding: 22,
    textAlign: "center",
  },
  montoConfirmar: { fontSize: 36, fontWeight: 700, color: COLORS.azul, margin: "8px 0" },
  contactoConfirmar: { fontSize: 22, fontWeight: 700, color: COLORS.azul, margin: "6px 0 0" },
  avisoConfirmar: { fontSize: 16, color: COLORS.textoSecundario, textAlign: "center", margin: "18px 0" },
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
  tituloExito: { fontSize: 24, fontWeight: 700, color: COLORS.azul, margin: "0 0 10px" },
  detalleExito: { fontSize: 18, color: "#3D3D3A", margin: "0 0 32px" },
  tarjetaCuenta: {
    background: COLORS.blanco,
    border: `2px solid ${COLORS.verde}`,
    borderRadius: 16,
    padding: 22,
    margin: "20px 0",
  },
  numeroCuenta: { fontSize: 28, fontWeight: 700, color: COLORS.azul, margin: 0, letterSpacing: 1 },
  filaMovimiento: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: COLORS.blanco,
    borderLeft: "6px solid",
    borderRadius: "0 12px 12px 0",
    padding: "14px 16px",
  },
  movTitulo: { fontSize: 17, fontWeight: 700, color: COLORS.azul, margin: 0 },
  movFecha: { fontSize: 14, color: COLORS.textoSecundario, margin: "2px 0 0" },
  movMonto: { fontSize: 18, fontWeight: 700, margin: 0 },
  listaAyuda: { fontSize: 18, color: "#3D3D3A", lineHeight: 1.8, paddingLeft: 22 },
};
