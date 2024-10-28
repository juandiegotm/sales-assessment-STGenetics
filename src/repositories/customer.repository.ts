import { db } from "../config/database";
import { Customer, CustomerUpdate, NewCustomer } from "../types/db";

export async function findCustomerById(id: number) {
  return await db.selectFrom('customers')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function findCustomers(criteria: Partial<Customer>) {
    let query = db.selectFrom('customers')
  
    if (criteria.id) {
      query = query.where('id', '=', criteria.id)
    }
  
    if (criteria.name) {
      query = query.where('name', '=', criteria.name)
    }
  
    if (criteria.createdAt) {
      query = query.where('createdAt', '=', criteria.createdAt)
    }
  
    return await query.selectAll().execute()
  }

export async function createCustomers(customers: NewCustomer) {
    return await db.insertInto('customers')
    .values(customers)
    .executeTakeFirstOrThrow();
}

export async function updateCustomers(id: number, updateWith: CustomerUpdate) {
    await db.updateTable('customers').set(updateWith).where('id', '=', id).execute();
}

export async function deleteCustomers(id: number) {
    return await db.deleteFrom('customers').where('id', '=', id)
    .executeTakeFirst();
}
