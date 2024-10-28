import { Router } from 'express';
import { getSales, getSaleById, createSale, deleteSale, addSaleLine, updateSaleLine, closeSale, deleteSaleLine } from '../handlers/sales.handler';

const router = Router();

router.get('/', getSales);
router.post('/', createSale);
router.get('/:saleId', getSaleById);
router.delete('/:id', deleteSale);
router.post('/:saleId', addSaleLine);
router.put('/:saleId/saleLine/:saleLineId', updateSaleLine);
router.delete('/:saleId/saleLine/:saleLineId', deleteSaleLine);
router.post('/:saleId/close', closeSale);

export default router;