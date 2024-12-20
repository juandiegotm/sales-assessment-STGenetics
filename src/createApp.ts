import express from 'express';
import customerRouter from './routes/customer.route';
import itemRouter from './routes/item.route';
import saleRouter from './routes/sale.route';
import { initDatabase } from './config/database';

export function createApp() {
    const app = express();

    initDatabase();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/customers', customerRouter);
    app.use('/api/items', itemRouter);
    app.use('/api/sales', saleRouter);

    return app;
}