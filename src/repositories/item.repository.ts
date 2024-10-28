import { db } from "../config/database";
import { Item, ItemUpdate, NewItem } from "../types/db";

export async function findItemById(id: number) {
  return await db.selectFrom('items')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function findItems(criteria: Partial<Item>) {
    let query = db.selectFrom('items')
  
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

export async function createItems(items: NewItem) {
    return await db.insertInto('items')
    .values(items)
    .executeTakeFirstOrThrow();
}

export async function updateItems(id: number, updateWith: ItemUpdate) {
    await db.updateTable('items').set(updateWith).where('id', '=', id).execute();
}

export async function deleteItems(id: number) {
    return await db.deleteFrom('items').where('id', '=', id)
    .executeTakeFirst();
}

export async function getItemQuantity(id: number) {
  return await db.selectFrom('items').where('id', '=', id).select('quantity').executeTakeFirst();
}

export async function setItemQuantity(id: number, quantity: number) {
    return await db.updateTable('items').set({ quantity }).where('id', '=', id).execute();
}