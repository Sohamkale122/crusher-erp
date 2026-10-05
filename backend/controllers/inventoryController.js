import { repo } from '../data/repo.js';

export const getInventory = async (req, res) => {
  try {
    const { category } = req.query;
    const items = await repo.getInventory(category);
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const item = await repo.getInventoryById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, code, category, currentStockMT, reorderLevelMT, unitPricePerMT, bayLocation, description } = req.body;
    if (!name || !code || !category || unitPricePerMT === undefined) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const item = await repo.createInventory({
      name,
      code,
      category,
      currentStockMT: Number(currentStockMT) || 0,
      reorderLevelMT: Number(reorderLevelMT) || 50,
      unitPricePerMT: Number(unitPricePerMT),
      bayLocation: bayLocation || 'Yard A',
      description: description || ''
    });

    res.status(201).json({ success: true, message: 'Aggregate product created', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { currentStockMT, unitPricePerMT, reorderLevelMT, bayLocation, name } = req.body;
    const updates = {};
    if (currentStockMT !== undefined) updates.currentStockMT = Number(currentStockMT);
    if (unitPricePerMT !== undefined) updates.unitPricePerMT = Number(unitPricePerMT);
    if (reorderLevelMT !== undefined) updates.reorderLevelMT = Number(reorderLevelMT);
    if (bayLocation !== undefined) updates.bayLocation = bayLocation;
    if (name !== undefined) updates.name = name;

    const updated = await repo.updateInventory(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Stock item updated successfully', item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await repo.deleteInventory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Aggregate product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
