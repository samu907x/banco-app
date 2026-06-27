import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginBancario from "./LoginBancario.jsx";
import AppBancariaMayores from "./AppBancariaMayores.jsx";
import { supabase } from "./supabaseClient.js";
import "./index.css";

function Raiz() {
  // Mientras no haya sesión iniciada, se muestra el login.
  // datosUsuario guarda la información de la cuenta real traída de Supabase
  // (saldo, nombre, contactos, movimientos) para pasársela a la app.
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function manejarIniciarSesion(numeroCuenta, pin) {
    setCargando(true);

    // 1. Buscar la cuenta por número de cuenta y PIN.
    const { data: cuenta, error: errorCuenta } = await supabase
      .from("cuentas")
      .select("*")
      .eq("numero_cuenta", numeroCuenta)
      .eq("pin", pin)
      .single();

    if (errorCuenta || !cuenta) {
      setCargando(false);
      window.alert("Número de cuenta o clave incorrectos.");
      return;
    }

    // 2. Traer los movimientos de esa cuenta, los más recientes primero.
    const { data: movimientos } = await supabase
      .from("movimientos")
      .select("*")
      .eq("cuenta_id", cuenta.id)
      .order("fecha", { ascending: false });

    // 3. Traer los contactos guardados de esa cuenta.
    const { data: contactos } = await supabase
      .from("contactos")
      .select("*")
      .eq("cuenta_id", cuenta.id);

    setDatosUsuario({
      id: cuenta.id,
      nombreUsuario: `${cuenta.nombre} ${cuenta.apellido}`,
      saldo: cuenta.saldo,
      numeroCuenta: cuenta.numero_cuenta,
      telefonoAyuda: "01 8000 123 456",
      movimientos: (movimientos || []).map((m) => ({
        id: m.id,
        titulo: m.titulo,
        fecha: new Date(m.fecha).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "long",
        }),
        monto: m.monto,
      })),
      contactos: (contactos || []).map((c) => ({
        id: c.id,
        nombre: c.nombre,
        inicial: c.nombre.charAt(0).toUpperCase(),
      })),
    });

    setCargando(false);
  }

  async function manejarCrearCuenta(datos) {
    setCargando(true);

    // Genera un número de cuenta de 10 dígitos al azar.
    const numeroGenerado = String(Math.floor(1000000000 + Math.random() * 9000000000));

    const { error } = await supabase.from("cuentas").insert({
      numero_cuenta: numeroGenerado,
      pin: datos.pinNuevo,
      nombre: datos.nombre,
      apellido: datos.apellido,
      numero_documento: datos.numeroDocumento,
      telefono: datos.telefono,
      correo: datos.correo || null,
      saldo: 0,
    });

    setCargando(false);

    if (error) {
      window.alert("No se pudo crear la cuenta. Intente de nuevo.");
      console.error(error);
      return;
    }

    // Le devolvemos el número de cuenta generado al módulo de login,
    // que ya se encarga de mostrar la pantalla de éxito.
    datos.numeroCuentaNueva = numeroGenerado;
  }

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: 60, fontSize: 18, color: "#1B3A5C" }}>
        Cargando...
      </div>
    );
  }

  if (!datosUsuario) {
    return (
      <LoginBancario
        onIniciarSesion={manejarIniciarSesion}
        onCrearCuenta={manejarCrearCuenta}
      />
    );
  }

  return <AppBancariaMayores datos={datosUsuario} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="pagina">
      <Raiz />
    </div>
  </React.StrictMode>
);