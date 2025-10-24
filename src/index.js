"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
// Definimos el puerto. Usamos variables de entorno o un valor por defecto.
const PORT = parseInt(process.env.PORT || '3000');
// Creamos la aplicación Express
const app = (0, express_1.default)();
// Middleware para parsear JSON (esencial para la mayoría de APIs)
app.use(express_1.default.json());
// --- Definición de Rutas ---
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.status(200).json({
        message: '¡Bienvenido a mi API con Node.js, Express y TypeScript en 2025!'
    });
});
// Ruta de ejemplo: /api/saludo
app.get('/api/saludo', (req, res) => {
    res.status(200).json({ saludo: 'Hola desde la API' });
});
// --- Iniciar el Servidor ---
try {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}
catch (error) {
    if (error instanceof Error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
    }
    else {
        console.error('Ocurrió un error desconocido');
    }
}
//# sourceMappingURL=index.js.map