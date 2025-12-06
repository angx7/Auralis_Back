# 🎹 Auralis API

API REST de Auralis para autenticación, recomendaciones con IA, gestión de canciones y registro de sesiones de práctica. Pensada para integrarse con el front de práctica pianística y ofrecer métricas claras de progreso.

## ✨ Qué incluye

- 🔐 Autenticación con JWT y actualización de perfil.
- 🤖 Tips y reportes generados por IA.
- 🎵 Catálogo de canciones por dificultad.
- 📊 Registro de sesiones con métricas de precisión y tiempo.

## 🚀 Requisitos

- Node.js 18+
- MongoDB accesible (URI y base configurables vía variables de entorno)
- Clave de OpenAI para las rutas de IA

## 🧩 Variables de entorno

Crea un archivo `.env` con los siguientes valores:

```bash
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
DB_NAME=auralis
JWT_SECRET=supersecreto
JWT_EXPIRES=7d
OPENAI_API_KEY=tu_api_key
```

## 🛠️ Instalación y ejecución

1. Instala dependencias:

```bash
npm install
```

2. Entorno de desarrollo con recarga:

```bash
npm run dev
```

3. Producción:

```bash
npm start
```

La API queda disponible en `http://localhost:<PORT>`.

## 🌐 Rutas

Prefijo base `/` definido en `app.js`. Todas las rutas privadas requieren encabezado `Authorization: Bearer <token>`.

### 🩺 Salud

- `GET /`
  - Respuesta: `{ ok: true, message: "API funcionando correctamente 🚀, TQM SAMPEPE" }`

### 🔐 Autenticación (`/auth`)

- `POST /auth/register`
  - Body: `{ "username": "username", "email": "email", "password": "password" }`
  - Respuesta: `{ ok: true, message: "Usuario creado exitosamente", token, user }`
  - Error típico: `{ ok: false, message: "error_message" }`
- `POST /auth/login`
  - Body: `{ "email": "email", "password": "password" }`
  - Respuesta: `{ ok: true, token, user }`
  - Error típico: `{ ok: false, message: "error_message" }`
- `PUT /auth/profile`
  - Headers: `Authorization`
  - Body: `{ "newUsername": "nuevo", "newEmail": "nuevo@correo" }`
  - Respuesta: `{ ok: true, message: "Perfil actualizado", user }`
- `GET /auth/me`
  - Headers: `Authorization`
  - Respuesta: `{ ok: true, user }`

### 🤖 IA (`/ai`)

- `POST /ai/protip`
  - Headers: `Authorization`
  - Devuelve un tip corto de técnica pianística generado con OpenAI.
  - Ejemplo de respuesta: `{ ok: true, tip: "Practica polifonía lentísima, enfocando cada dedo en fuerza y control independiente." }`
- `GET /ai/report`
  - Headers: `Authorization`
  - Si hay sesiones recientes, entrega un resumen de progreso:
    ```json
    {
      "ok": true,
      "report": {
        "resumen": "…",
        "precisionGlobal": 83.7,
        "tendenciaPrecision": "mejora",
        "graficaPrecision": [78, 75, 88, 78, 87, 82, 75, 88, 91, 87],
        "ritmoEstableNivel": "medio",
        "dinamicaPuntaje": 91.4,
        "precisionActual": 87
      }
    }
    ```
  - Si no hay sesiones: `{ ok: true, message: "Sin sesiones para analizar", report: null }`

### 🎵 Canciones (`/songs`)

- `GET /songs`
  - Headers: `Authorization`
  - Lista todas las canciones disponibles con metadatos y URLs de recursos.
- `GET /songs/:id`
  - Headers: `Authorization`
  - Obtiene una canción por ID; si no existe: `{ ok: false, message: "Canción no encontrada" }`.

### 🕒 Sesiones (`/sessions`)

- `POST /sessions`
  - Headers: `Authorization`
  - Inicia una sesión y crea el registro con puntaje y métricas iniciales.
- `PUT /sessions/:id`
  - Headers: `Authorization`
  - Marca fin de sesión y actualiza puntaje, duración y métricas capturadas.
- `GET /sessions`
  - Headers: `Authorization`
  - Lista todas las sesiones del usuario (incluye datos de la canción asociada).
- `GET /sessions/:id`
  - Headers: `Authorization`
  - Detalle de una sesión específica.
- `GET /sessions/month`
  - Headers: `Authorization`
  - Devuelve resumen de tiempo total y precisión promedio del mes.

## 🗄️ Modelos y persistencia

La conexión a MongoDB se configura en `config/mongo.js` y utiliza Mongoose. Las entidades principales incluyen usuarios (`models/User.js`), canciones (`models/Song.js`) y sesiones (`models/Session.js`).

## 🔒 Autenticación y seguridad

- JWT firmado con `JWT_SECRET`; expiración configurable con `JWT_EXPIRES`.
- `middleware/authMiddleware.js` valida el token y expone `req.user` para las rutas protegidas.

## 🧭 Notas rápidas

- Todas las respuestas de error incluyen `ok: false` y un mensaje descriptivo.
- Las rutas de IA requieren `OPENAI_API_KEY` válido.
- Si algo falla, revisa los logs de consola para mensajes detallados de validación y conexión.

## 👤 Autores

Desarrollado por
**Angel Becerra (@angx7)**
**Abraham Rodríguez (@bardodepacotilla2912)**
**Christian Moreno (@Kuripipeer)**
**Sergio Rosas (@SergioErnestoRosasDucoing)**
**Héctor Adrian (@TachyonSlash)**
