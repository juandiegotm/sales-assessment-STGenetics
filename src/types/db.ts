import {
    ColumnType,
    Generated,
    Insertable,
    Selectable, 
    Updateable
} from 'kysely';

export interface DatabaseSchema {
    customers: CustomerTable;
}

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

