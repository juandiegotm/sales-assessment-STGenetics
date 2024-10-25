import request from 'supertest';
import { createApp } from '../createApp';
import { type Express } from 'express';

describe('customers', () => {
    let app: Express;

    beforeAll(() => {
        app = createApp();
    });

    it("it should return an empty array", async () => {
        const response = await request(app).get('/api/customers');
        expect(response.body).toStrictEqual([]); 
    });
});
