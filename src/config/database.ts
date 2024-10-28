import { DatabaseSchema } from '../types/databaseSchema';
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect, sql, Migrator, FileMigrationProvider } from 'kysely';

import { promises as fs } from 'fs'
import * as path from 'path'

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
    await migrateToLatest();
    console.log('Database initialized');
}

async function migrateToLatest() {
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder: path.join(__dirname, '../migrations'),
        }),
      })

    const {error, results} = await migrator.migrateToLatest();

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    });
    

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }
}

export async function testConnection(db: Kysely<DatabaseSchema>) {
    await sql`SELECT 1`.execute(db);
}