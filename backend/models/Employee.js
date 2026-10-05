import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Half-Day', 'Overtime'], 
    default: 'Present' 
  },
  overtimeHours: { type: Number, default: 0 },
  markedBy: { type: String, default: 'System' }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { 
    type: String, 
    enum: ['Crusher Operations', 'Weighbridge', 'Transport & Fleet', 'Maintenance', 'Management & Accounts'],
    required: true 
  },
  phone: { type: String, required: true },
  dailyWage: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'On-Leave', 'Terminated'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  attendance: [attendanceRecordSchema]
});

export const Employee = mongoose.model('Employee', employeeSchema);
