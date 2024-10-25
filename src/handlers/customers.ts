import { Request, Response } from 'express';
import { CreateCustDTO } from '../dtos/CreateCust.dto';
import { CreateCustQueryParams } from '../types/query-params';
import Customer from '../types/response';

export function getCustomers(request: Request, response: Response) {
    response.send([]);
}

export function getCustomerById(request: Request, response: Response) {
    response.send({});
}

export function createCustomer(
    request: Request<{}, {}, CreateCustDTO, CreateCustQueryParams>, 
    response: Response<Customer>) {

    response.status(200).send({
        id: 1,
        name: 'Juan',
    });
}