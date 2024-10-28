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

