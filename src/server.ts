import express from 'express';
import type { Express } from 'express';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import morgan from 'morgan';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import 'dotenv/config';

connectDB();

const app: Express = express();

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList: (string | undefined)[] = [process.env.FRONTEND_URL];

        if (process.argv[2] == '--api') {
            whiteList.push(undefined);
        };

        if (whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Cors ERROR'));
        };
    },
};

// Cors
app.use(cors(corsOptions));

// Logging
app.use(morgan('dev'));

// Read JSON format
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app;