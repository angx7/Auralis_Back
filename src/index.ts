import express, { Application, Request, Response } from 'express';

// Definimos el puerto. Usamos variables de entorno o un valor por defecto.
const PORT: number = parseInt(process.env.PORT || '3000');

// Creamos la aplicación Express
const app: Application = express();

// Middleware para parsear JSON (esencial para la mayoría de APIs)
app.use(express.json());

// --- Definición de Rutas ---

// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: '¡Bienvenido a mi API con Node.js, Express y TypeScript en 2025!'
    });
});

// Ruta de ejemplo: /api/saludo
app.get('/api/saludo', (req: Request, res: Response) => {
    res.status(200).json({ saludo: 'Hola desde la API' });
});

// --- Iniciar el Servidor ---
try {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
    } else {
        console.error('Ocurrió un error desconocido');
    }
}