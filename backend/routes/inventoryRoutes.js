import express from 'express';
import { getInventory, getProductById, createProduct, updateStock, deleteProduct } from '../controllers/inventoryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getInventory);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateStock);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteProduct);

export default router;
