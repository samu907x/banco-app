import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginBancario from "./LoginBancario.jsx";
import AppBancariaMayores from "./AppBancariaMayores.jsx";
import "./index.css";

function Raiz() {
  // Mientras no haya sesión iniciada, se muestra el login.
  // Cuando el login llama a onIniciarSesion (o se crea una cuenta y se entra),
  // pasamos a mostrar la app bancaria completa.
  const [sesionIniciada, setSesionIniciada] = useState(false);

  function manejarIniciarSesion(numeroCuenta, pin) {
    // TODO: aquí va tu validación real contra el backend.
    // Por ahora, cualquier número de cuenta + PIN de 4 dígitos entra.
    console.log("Intentando entrar con:", { numeroCuenta, pin });
    setSesionIniciada(true);
  }

  function manejarCrearCuenta(datos) {
    // TODO: aquí va tu llamada real para registrar la cuenta en el backend.
    console.log("Cuenta creada con datos:", datos);
    // No metemos sesión automática aquí: el módulo de login ya lleva
    // al usuario de vuelta a la pantalla de "Entrar" con su nuevo número de cuenta.
  }

  if (!sesionIniciada) {
    return (
      <LoginBancario
        onIniciarSesion={manejarIniciarSesion}
        onCrearCuenta={manejarCrearCuenta}
      />
    );
  }

  return <AppBancariaMayores />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="pagina">
      <Raiz />
    </div>
  </React.StrictMode>
);