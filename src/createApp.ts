import express from 'express';
import customerRouter from './routes/customers';

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/customers', customerRouter);

    return app;
}