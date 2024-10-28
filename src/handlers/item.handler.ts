import { Request, Response } from 'express';
import { ItemDTO } from '../dtos/item.dto';
import * as itemRepository from '../repositories/item.repository';

export async function getItems(request: Request, response: Response) {
    const items = await itemRepository.findItems({});
    response.send(items);
}

export async function getItemById(
    request: Request<{id: string}>, 
    response: Response) {
    
    const id = parseInt(request.params.id);

    const searchedItem = await itemRepository.findItemById(id);
    response.send(searchedItem);
}   

export async function createItem(
    request: Request<{}, {}, ItemDTO>, 
    response: Response) {

    const newItem = request.body;
    const rawItem = await itemRepository.createItems(newItem);

    const responseItem = {
        id: rawItem.insertId?.toString(),
    }

    response.status(200).send(responseItem);
}

export async function updateItem(
    request: Request<{id: string}, {}, ItemDTO>, 
    response: Response) {

    const id = parseInt(request.params.id);
    const updateWith = request.body;

    await itemRepository.updateItems(id, updateWith);
    response.status(200).send({
        success: true
    });
}

export async function deleteItem(
    request: Request<{id: string}>, 
    response: Response) {

    const id = parseInt(request.params.id);
    await itemRepository.deleteItems(id);
    response.status(200).send({
        success: true
    });
}