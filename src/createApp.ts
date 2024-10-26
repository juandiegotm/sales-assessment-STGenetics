import express from 'express';
import customerRouter from './routes/customers';
import { initDatabase } from './config/database';

export function createApp() {
    const app = express();

    initDatabase();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/customers', customerRouter);

    return app;
}