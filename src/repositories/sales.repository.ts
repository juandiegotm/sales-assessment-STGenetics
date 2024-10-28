import { db } from "../config/database";
import { SaleDTO, CreateSaleLineDTO } from "../dtos/sale.dto";
import { Sale, NewSale, SaleUpdate, SaleLine, NewSaleLine } from "../types/db";

// Sales Table CRUD Operations
export async function findSaleById(id: number, detailed = false) {
  const sale = await db.selectFrom('sales')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();

  if (sale) {
    if (detailed) {
      const saleLines = await findSalesLinesBySaleId(id);
      return { ...sale, saleLines };
    }
    return sale;
  }

  return null;
}

// Find sales based on optional criteria
export async function findSales(criteria: Partial<Sale>) {
  let query = db.selectFrom('sales');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id);
  }
  
  if (criteria.customerId) {
    query = query.where('customerId', '=', criteria.customerId);
  }
  
  return await query.selectAll().execute();
}

// Create a new sale
export async function createSale(newSale: NewSale) {
  return await db.insertInto('sales')
    .values(newSale)
    .executeTakeFirstOrThrow();
}

export async function updateSale(id: number, updateWith: Partial<SaleUpdate>) {
  return await db.updateTable('sales')
    .set(updateWith)
    .where('id', '=', id)
    .execute();
}

// Delete a sale
export async function deleteSale(id: number) {
  return await db.deleteFrom('sales')
    .where('id', '=', id)
    .executeTakeFirst();
}

// Find SalesLine entries for a specific sale ID
export async function findSalesLine(id: number) {
  return await db.selectFrom('salesLines')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function saleLineByItemAndSaleId(itemId: number, saleId: number) { 
  return await db.selectFrom('salesLines')
    .where('itemId', '=', itemId)
    .where('saleId', '=', saleId)
    .selectAll()
    .executeTakeFirst();
}


export async function findSalesLinesBySaleId(saleId: number) {
  return await db.selectFrom('salesLines')
    .where('saleId', '=', saleId)
    .selectAll()
    .execute();
}

// Add a new SalesLine to a sale
export async function addSalesLine(saleLine: NewSaleLine) {
  return await db.insertInto('salesLines')
    .values({
      ...saleLine,
    })
    .executeTakeFirstOrThrow();
}

export async function isSaleClosed(saleId: number): Promise<boolean> {
  const sale = await db.selectFrom('sales')
      .where('id', '=', saleId)
      .select(['status'])
      .executeTakeFirst();
  
  return sale?.status === 'closed'; // Lógica de negocio aquí
}

// Update an existing SalesLine entry
export async function updateSaleLine(id: number, updateWith: Partial<SaleLine>) {
  return await db.updateTable('salesLines')
    .set(updateWith)
    .where('id', '=', id)
    .execute();
}

// Delete a SalesLine entry by its ID
export async function deleteSaleLine(id: number) {
  return await db.deleteFrom('salesLines')
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function closeSale(id: number, totalAmount: number) {
  return await db.updateTable('sales')
    .set({ status: 'closed', totalAmount, updatedAt: new Date() })
    .where('id', '=', id)
    .execute();
}


export async function findSaleBySaleLineId(saleLineId: number) {
  const saleId = await db.selectFrom('salesLines')
    .where('id', '=', saleLineId)
    .select(['saleId'])
    .executeTakeFirst();

  return saleId ? findSaleById(saleId.saleId) : null;
}
