# App bancaria — tercera edad

App bancaria interactiva pensada para personas mayores: texto grande, botones grandes y fáciles de tocar, confirmación clara antes de cualquier envío de dinero, y lectura en voz alta del saldo y la ayuda.

## Cómo correrla

Necesitas tener [Node.js](https://nodejs.org) instalado (versión 18 o más reciente).

```bash
npm install
npm run dev
```

Esto abre la app en tu navegador, normalmente en `http://localhost:5173`.

## Otros comandos

```bash
npm run build     # genera la versión final para producción en la carpeta dist/
npm run preview   # previsualiza esa versión final
```

## Estructura del proyecto

```
app-bancaria/
├── index.html              punto de entrada HTML
├── package.json            dependencias y scripts
├── vite.config.js          configuración de Vite
└── src/
    ├── main.jsx             arranca React
    ├── index.css            estilos generales de la página
    └── AppBancariaMayores.jsx   el componente de la app (toda la lógica vive aquí)
```

## Personalizar los datos

Dentro de `src/AppBancariaMayores.jsx`, busca el objeto `DATOS_EJEMPLO` cerca del inicio del archivo. Ahí están marcados con `// TODO` los lugares donde debes conectar tus datos reales: nombre del usuario, saldo, número de cuenta, contactos y movimientos.

También puedes pasarle los datos como prop en `src/main.jsx`:

```jsx
<AppBancariaMayores datos={misDatosReales} />
```

## Conectar el envío de dinero a tu backend

Dentro del componente, busca la función `finalizarEnvio()`. Ahí hay un `// TODO` donde debes agregar la llamada real a tu API antes de mostrar la pantalla de éxito.
