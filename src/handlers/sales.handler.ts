import { Request, Response } from 'express';
import { SaleDTO, CreateSaleLineDTO, UpdateSaleLineDTO } from '../dtos/sale.dto'; // Asegúrate de tener un DTO para las ventas
import * as saleRepository from '../repositories/sales.repository'; // Asegúrate de tener el repositorio correspondiente
import * as itemRepository from '../repositories/item.repository'; // Asegúrate de tener el repositorio correspondiente
import { SaleLine, SaleLineUpdate } from '../types/db';
export async function getSales(request: Request, response: Response) {
    const sales = await saleRepository.findSales({});
    response.send(sales);
}

export async function getSaleById(
    request: Request<{saleId: string}>, 
    response: Response) {
    
    const saleId = parseInt(request.params.saleId);
    const searchedSale = await saleRepository.findSaleById(saleId, true);

    if (!searchedSale) {
        response.status(404).send({
            error: 'Not found'
        });
        return;
    }

    response.send(searchedSale);
}   

export async function createSale(
    request: Request<{}, {}, SaleDTO>, 
    response: Response) {

    const newSale = request.body;
    const rawSale = await saleRepository.createSale({
        ...newSale,
        status: 'open',
        totalAmount: 0,
        updatedAt: new Date(),
    });

    const responseSale = {
        id: rawSale.insertId?.toString(),
    }

    response.status(201).send(responseSale);
}

export async function deleteSaleLine(
    request: Request<{saleId: string, saleLineId: string}>, 
    response: Response) {

    const saleId = parseInt(request.params.saleId);
    const saleLineId = parseInt(request.params.saleLineId);

    const searchSale = await saleRepository.findSaleById(saleId, false);

    if (!searchSale) {
        response.status(404).send({
            error: 'Not found'
        });
        return;
    } else if (searchSale.status === 'closed') {
        response.status(400).send({
            error: 'No se puede eliminar una venta cerrada'
        });
        return;
    }

    const searchSaleLine = await saleRepository.findSalesLine(saleLineId);
    if (!searchSaleLine) {
        response.status(404).send({
            error: 'Not found'
        });
        return;
    }

    await saleRepository.deleteSaleLine(saleLineId);
    await saleRepository.updateSale(saleId, { updatedAt: new Date() });
    response.status(200).send({
        success: true
    });
}

export async function deleteSale(
    request: Request<{id: string}>, 
    response: Response) {

    const id = parseInt(request.params.id);
    const searchSale = await saleRepository.findSaleById(id, true);

    if (!searchSale) {
        response.status(404).send({
            error: 'Not found'
        });
        return;

    } else if (searchSale.status === 'closed') {
        response.status(400).send({
            error: 'No se puede eliminar una venta cerrada'
        });
        return;
    }

    // If cascade works, it should eliminate all. CHECK
    if ('saleLines' in searchSale) {
        for(let saleLine of searchSale.saleLines)
            await saleRepository.deleteSaleLine(saleLine.id);
    }
    await saleRepository.deleteSale(id);
    response.status(200).send({
        success: true
    });
}

export async function addSaleLine(
    request: Request<{saleId: string}, {}, CreateSaleLineDTO>, 
    response: Response) {

    const saleId = parseInt(request.params.saleId);

    if(await saleRepository.isSaleClosed(saleId)) {
        response.status(400).send({
            error: 'Cannot add a sale line to a closed sale'
        });
        return;
    }

    const saleLineDTO = request.body;

    if(saleLineDTO?.discount && saleLineDTO.discount > 0.9){
        response.status(400).send({
            error: 'Discount cannot be higher than 90%'
        });
        return;
    }

     const searchItem = await itemRepository.findItemById(saleLineDTO.itemId);
     if(!searchItem){
        response.status(404).send({ error: 'Item not found.' });
        return;
     }

     // Verify is there is an saleOrder with the same item
    const searchSaleLine = await saleRepository.saleLineByItemAndSaleId(saleLineDTO.itemId, saleId);
    if(searchSaleLine){
        response.status(400).send({ error: 'Item already in order.' });
        return;
    }

     const { quantity, price } = searchItem; 
     if (quantity > searchItem.quantity) {
        response.status(400).send({ error: 'Insufficient stock available.' });
        return;
     }

     // Calcular el descuento y el subtotal
     const realDiscount = saleLineDTO.discount || 0;
     const subtotal = price * saleLineDTO.quantity * (1 - realDiscount);
     
     // Agregar la línea de venta
    const rawSaleLine = await saleRepository.addSalesLine({
        ...saleLineDTO,
        saleId,
        originalPrice: price,
        subtotal
    });

    const responseSaleLine = {
        id: rawSaleLine.insertId?.toString(),
    }

    response.status(201).send(responseSaleLine);
}


export async function updateSaleLine(
    request: Request<{saleId: string, saleLineId: string}, {}, Partial<UpdateSaleLineDTO>>, 
    response: Response) {

    const saleId = parseInt(request.params.saleId);
    const saleLineId = parseInt(request.params.saleLineId);

    if(await saleRepository.isSaleClosed(saleId)) {
        response.status(400).send({
            error: 'Cannot add a sale line to a closed sale'
        });
        return;
    }

    const updateSaleLineDTO = request.body;

    if(updateSaleLineDTO?.discount && updateSaleLineDTO.discount > 0.9){
        response.status(400).send({
            error: 'Discount cannot be higher than 90%'
        });
        return;
    }

    const saleLine = await saleRepository.findSalesLine(saleLineId);
    if (!saleLine) {
        response.status(404).send({
            error: 'Not found'
        });
        return;
    }

     const searchItem = await itemRepository.findItemById(saleLine.itemId);
     if(!searchItem){
        response.status(404).send({ error: 'Item not found.' });
        return;
     }

     const updateWith = { ...updateSaleLineDTO } as SaleLineUpdate;

    if(updateSaleLineDTO.quantity){
        const { quantity } = searchItem;
        const newQuantity = quantity - updateSaleLineDTO.quantity;
        if (newQuantity < 0) {
            response.status(400).send({ error: 'Insufficient stock available.' });
            return;
        }

        const realDiscount = updateSaleLineDTO.discount || saleLine.discount || 0;
        const subtotal = searchItem.price * updateSaleLineDTO.quantity * (1 - realDiscount);
        updateWith.subtotal = subtotal;
    }

    await saleRepository.updateSale(saleId, { updatedAt: new Date() });

    await saleRepository.updateSaleLine(saleLineId, updateWith);
    response.status(200).send({
        success: true
    });
}


export async function closeSale(
    request: Request<{saleId: string}>, 
    response: Response) {

    const saleId = parseInt(request.params.saleId);
    const sale = await saleRepository.findSaleById(saleId, true);

    // TODO: Add transactionality
    if (!sale) {
        response.status(404).send({
            error: 'Not found'
        });
        return;
    } else if ('saleLines' in sale) {
        const salesLines = sale.saleLines;
        let totalAmount = 0;
        for(let saleLine of salesLines) {
            const wasDone = await closeSaleLine(saleLine);
            if(wasDone){
                totalAmount += parseFloat(saleLine.subtotal.toString());
            }
   
        }

        await saleRepository.closeSale(saleId, totalAmount);
    } 
    
    response.status(200).send({
        success: true
    });
}

async function closeSaleLine(saleLine: SaleLine) {
    const search = await itemRepository.getItemQuantity(saleLine.itemId);
    const quantity = search?.quantity;
    if(!quantity) return false;
    
    const newQuantity = quantity - saleLine.quantity;
    if(newQuantity < 0) return false;

    await itemRepository.setItemQuantity(saleLine.itemId, newQuantity);
    return true;
}
