import express from 'express';
import { getEmployees, createEmployee, markAttendance, getPayrollSummary } from '../controllers/employeeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getEmployees);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createEmployee);
router.post('/attendance', authenticateToken, authorizeRoles('admin', 'manager'), markAttendance);
router.get('/payroll', authenticateToken, authorizeRoles('admin', 'manager', 'accountant'), getPayrollSummary);

export default router;
