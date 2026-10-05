import { repo } from '../data/repo.js';

export const getMachinery = async (req, res) => {
  try {
    const list = await repo.getMachinery();
    res.json({ success: true, count: list.length, machinery: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMachinery = async (req, res) => {
  try {
    const updated = await repo.updateMachinery(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, message: 'Machinery log updated', machinery: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createMachinery = async (req, res) => {
  try {
    const { name, type, status, assignedOperator, operatingHoursToday, fuelConsumedLitersToday } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Machine name and type are required' });
    }
    const machineCode = `EQ-${Math.floor(100 + Math.random() * 900)}`;
    const doc = await repo.createMachinery({
      machineCode,
      name,
      type,
      status: status || 'Running',
      assignedOperator: assignedOperator || 'Operator',
      operatingHoursToday: Number(operatingHoursToday) || 0,
      fuelConsumedLitersToday: Number(fuelConsumedLitersToday) || 0,
      healthRatingPercent: 95
    });
    res.status(201).json({ success: true, machinery: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
