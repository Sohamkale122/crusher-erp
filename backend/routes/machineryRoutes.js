import express from 'express';
import { getMachinery, updateMachinery, createMachinery } from '../controllers/machineryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getMachinery);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createMachinery);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager', 'operator'), updateMachinery);

export default router;
