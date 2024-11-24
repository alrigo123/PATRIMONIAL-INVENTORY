import express from 'express';
import { PORT } from "./config.js";
import cors from 'cors';
import helmet from 'helmet';
// npm install helmet --> Protege tu aplicación Express.js de vulnerabilidades comunes
import rateLimit from 'express-rate-limit';
// npm install express-rate-limit --> Esto evita ataques de denegación de servicio (DoS).

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.'
});

const app = express();

//Middleware
// Configuración CORS para permitir accesos desde cualquier origen (o especificar la IP del cliente)
app.use(cors({ origin: '*' }));
app.use(express.json()) //process data to send to the backend
app.use(helmet());
app.use(limiter);

//Routes
import routes from './routes/index.routes.js';
import item_routes from './routes/item.routes.js';
import export_reports from './routes/export.routes.js'

//app
app.use(routes)
app.use('/items',item_routes)
app.use('/export',export_reports)

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});