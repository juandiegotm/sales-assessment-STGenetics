
import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer} from '../handlers/customers';

const router = Router();

// /api/customers
router.get('/', getCustomers);

// /api/customers/:id
router.get('/:id', getCustomerById);

// /api/customers
router.post('/', createCustomer);

export default router;