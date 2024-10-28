
import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer} from '../handlers/customer.handler';

const router = Router();

// /api/customers
router.get('/', getCustomers);

// /api/customers/:id
router.get('/:id', getCustomerById);

// /api/customers
router.post('/', createCustomer);

// /api/customers/:id
router.put('/:id', updateCustomer);

// /api/customers/:id
router.delete('/:id', deleteCustomer);

export default router;