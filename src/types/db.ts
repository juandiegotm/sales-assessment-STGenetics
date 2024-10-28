import {
    ColumnType,
    Generated,
    Insertable,
    Selectable, 
    Updateable
} from 'kysely';

export interface DatabaseSchema {
    customers: CustomerTable;
    items: ItemTable;
    sales: SaleTable;
    salesLines: SaleLineTable;
}

/* CustomerEntity */
export interface CustomerTable {
    id: Generated<number>
    name: string;
    phone: string;
    streetAdress1: string;
    streetAdress2: string | null;
    city: string;
    state: string;
    zipCode: string;
    createdAt: ColumnType<Date, string | undefined, never>
}

export type Customer = Selectable<CustomerTable>;
export type NewCustomer = Insertable<CustomerTable>;
export type CustomerUpdate = Updateable<CustomerTable>;

/* ItemEntity */
export interface ItemTable {
    id: Generated<number>
    name: string;
    quantity: number;
    price: number;
    createdAt: ColumnType<Date, string | undefined, never>
}

export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>; 

export interface SaleTable {
    id: Generated<number>;
    customerId: number;
    status: 'open' | 'closed';
    totalAmount: number;
    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, Date, Date>;
}

export type Sale = Selectable<SaleTable>;
export type NewSale = Insertable<SaleTable>;
export type SaleUpdate = Updateable<SaleTable>;

export interface SaleLineTable {
    id: Generated<number>;
    saleId: number; // Foreign key hacia la orden de venta
    itemId: number; // Foreign key hacia el producto
    quantity: number; // Cantidad de productos en esta línea
    originalPrice: number; // Precio original del producto
    discount: number | null; // Descuento aplicado, como porcentaje (ej. 0.1 para 10%)
    subtotal: number; // Total calculado para esta línea (originalPrice * quantity * (1 - discount))
}

export type SaleLine = Selectable<SaleLineTable>;
export type NewSaleLine = Insertable<SaleLineTable>;
export type SaleLineUpdate = Updateable<SaleLineTable>;