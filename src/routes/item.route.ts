import { Router } from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../handlers/item.handler';

const router = Router();

// /api/items
router.get('/', getItems);

// /api/items/:id
router.get('/:id', getItemById);

// /api/items
router.post('/', createItem);

// /api/items/:id
router.put('/:id', updateItem);

// /api/items/:id
router.delete('/:id', deleteItem);

export default router;
