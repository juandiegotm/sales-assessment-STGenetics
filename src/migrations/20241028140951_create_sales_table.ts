import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('sales')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('customerId', 'integer', (col) =>
            col.references('customers.id').onDelete('cascade').notNull()
        )
        .addColumn('totalAmount', sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('open'))
        .addColumn('createdAt', 'timestamp', (col) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .addColumn('updatedAt', 'timestamp', (col) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .execute();

    await db.schema
        .createTable('salesLines')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('saleId', 'integer', (col) =>
            col.references('sales.id').onDelete('cascade').notNull()
        )
        .addColumn('itemId', 'integer', (col) =>
            col.references('items.id').onDelete('restrict').notNull()
        )
        .addColumn('quantity', 'integer', (col) => col.notNull())
        .addColumn('discountPercentage', sql`decimal(3,2)`, (col) =>
            col.check(sql`discountPercentage >= 0 AND discountPercentage <= 1.0`)
        )
        .addColumn('originalPrice', sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn('subtotal', sql`decimal(10,2)`, (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('salesLines').execute();
    await db.schema.dropTable('sales').execute(); 
}