import {
    Generated,
    Insertable,
    Selectable, 
    Updateable
} from 'kysely';

export interface DatabaseSchema {
    customer: CustomerTable;
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
}

export type Customer = Selectable<CustomerTable>;
export type NewCustomer = Insertable<CustomerTable>;
export type CustomerUpdate = Updateable<CustomerTable>;

