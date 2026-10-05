import { repo } from '../data/repo.js';

export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const employees = await repo.getEmployees(department);
    res.json({ success: true, count: employees.length, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, designation, department, phone, dailyWage, status } = req.body;
    if (!name || !designation || !department || !dailyWage) {
      return res.status(400).json({ success: false, message: 'Missing required employee information' });
    }

    const employeeCode = `EMP-${Math.floor(100 + Math.random() * 900)}`;

    const emp = await repo.createEmployee({
      employeeCode,
      name,
      designation,
      department,
      phone: phone || '',
      dailyWage: Number(dailyWage),
      status: status || 'Active',
      attendance: []
    });

    res.status(201).json({ success: true, message: 'Employee added successfully', employee: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, overtimeHours } = req.body;
    if (!employeeId || !date || !status) {
      return res.status(400).json({ success: false, message: 'employeeId, date and status are required' });
    }

    const updated = await repo.markAttendance(employeeId, {
      date,
      status,
      overtimeHours: Number(overtimeHours) || 0,
      markedBy: req.user ? req.user.name : 'Supervisor'
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Attendance marked', employee: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPayrollSummary = async (req, res) => {
  try {
    const employees = await repo.getEmployees();
    const summary = employees.map(emp => {
      let presentDays = 0;
      let halfDays = 0;
      let absentDays = 0;
      let totalOvertimeHours = 0;

      (emp.attendance || []).forEach(record => {
        if (record.status === 'Present') presentDays++;
        else if (record.status === 'Half-Day') halfDays++;
        else if (record.status === 'Absent') absentDays++;
        if (record.overtimeHours) totalOvertimeHours += record.overtimeHours;
      });

      const effectiveDays = presentDays + halfDays * 0.5;
      const basePay = effectiveDays * emp.dailyWage;
      // Overtime rate: 1.5x hourly wage (assuming 8-hour workday)
      const hourlyWage = emp.dailyWage / 8;
      const overtimePay = parseFloat((totalOvertimeHours * hourlyWage * 1.5).toFixed(2));
      const grossSalary = parseFloat((basePay + overtimePay).toFixed(2));

      return {
        id: emp._id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        dailyWage: emp.dailyWage,
        presentDays,
        halfDays,
        absentDays,
        totalOvertimeHours,
        basePay,
        overtimePay,
        grossSalary
      };
    });

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
