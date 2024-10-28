import { Request, Response } from 'express';
import { CustomerDTO } from '../dtos/customer.dto';
import * as customerRepository from '../repositories/customer.repository';
import Customer from '../types/response';
import { raw } from 'mysql2';

export async function getCustomers(request: Request, response: Response) {
    const customers = await customerRepository.findCustomers({});
    response.send(customers);
}

export async function getCustomerById(
    request: Request<{id: string}>, 
    response: Response) {
    
    const id = parseInt(request.params.id);

    const searchedCustomer = await customerRepository.findCustomerById(id);
    response.send(searchedCustomer);
}   

export async function createCustomer(
    request: Request<{}, {}, CustomerDTO>, 
    response: Response) {

    const newCustomer = request.body;
    const rawcustomer = await customerRepository.createCustomers(newCustomer);

    const responseCustomer = {
        id: rawcustomer.insertId?.toString(),
    }

    response.status(200).send(responseCustomer);
}

export async function updateCustomer(
    request: Request<{id: string}, {}, CustomerDTO>, 
    response: Response) {

    const id = parseInt(request.params.id);
    const updateWith = request.body;

    await customerRepository.updateCustomers(id, updateWith);
    response.status(200).send({
        success: true
    });
}

export async function deleteCustomer(
    request: Request<{id: string}>, 
    response: Response) {

    const id = parseInt(request.params.id);
    await customerRepository.deleteCustomers(id);
    response.status(200).send({
        success: true
    });
}