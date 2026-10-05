import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Aggregate', 'Sand', 'Base Material', 'Raw Boulder', 'Dust'],
    required: true 
  },
  currentStockMT: { type: Number, required: true, default: 0 },
  reorderLevelMT: { type: Number, required: true, default: 50 },
  unitPricePerMT: { type: Number, required: true },
  bayLocation: { type: String, default: 'Yard A' },
  description: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
