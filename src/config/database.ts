import { DatabaseSchema } from '../types/databaseSchema';
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect, sql } from 'kysely';

export let db: Kysely<DatabaseSchema>;
const pool = createPool({
    database: 'sales',
    host: 'mysql',
    user: 'admin',
    password: 'admin',
    port: 3306,
    connectionLimit: 10,
})

export async function initDatabase() {
    const dialect = new MysqlDialect({
        pool,
    });

    db = new Kysely<DatabaseSchema>({dialect});
    await testConnection(db);
    console.log('Database initialized');
}

export async function testConnection(db: Kysely<DatabaseSchema>) {
    await sql`SELECT 1`.execute(db);
}