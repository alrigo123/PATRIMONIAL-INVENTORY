import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
// npm install helmet --> Protege tu aplicación Express.js de vulnerabilidades comunes
import rateLimit from 'express-rate-limit';
// npm install express-rate-limit --> Esto evita ataques de denegación de servicio (DoS).

// Cargar las variables del archivo .env
config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.'
});
  
const app = express();

//Middleware
// Configuración CORS para permitir accesos desde cualquier origen
app.use(cors({ origin: '*' }));
app.use(express.json()) //process data to send to the backend
app.use(helmet());
app.use(limiter);

// Middleware para deshabilitar el caché
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Surrogate-Control', 'no-store');
    next();
});

//Routes
import routes from './routes/index.routes.js';
import item_routes from './routes/item.routes.js';
import export_reports from './routes/export.routes.js'

//app
app.use(routes)
app.use('/items', item_routes)
app.use('/export', export_reports)

const puerto = process.env.SERVER_PORT;

app.listen(puerto, () => {
    console.log(`listening on http://localhost:${puerto}`);
}); 