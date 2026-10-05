import express from 'express';
import { getDispatches, getDispatchById, createDispatch, updateDispatch } from '../controllers/salesController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getDispatches);
router.get('/:id', authenticateToken, getDispatchById);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager', 'operator'), createDispatch);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager', 'accountant'), updateDispatch);

export default router;
