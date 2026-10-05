import mongoose from 'mongoose';

const machinerySchema = new mongoose.Schema({
  machineCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Primary Jaw Crusher', 'Cone Crusher', 'VSI Sand Maker', 'Vibrating Screen', 'Wheel Loader', 'Excavator', 'Generator / DG Set'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Running', 'Idle', 'Maintenance', 'Breakdown'], 
    default: 'Running' 
  },
  operatingHoursToday: { type: Number, default: 0 },
  fuelConsumedLitersToday: { type: Number, default: 0 },
  lastServiceDate: { type: Date, default: Date.now },
  nextServiceHours: { type: Number, default: 250 },
  assignedOperator: { type: String, default: 'General Operator' },
  healthRatingPercent: { type: Number, default: 95 }
});

export const Machinery = mongoose.model('Machinery', machinerySchema);
