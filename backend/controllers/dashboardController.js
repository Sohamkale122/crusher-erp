import { repo } from '../data/repo.js';

export const getDashboardStats = async (req, res) => {
  try {
    const dispatches = await repo.getDispatches();
    const inventory = await repo.getInventory();
    const employees = await repo.getEmployees();
    const machinery = await repo.getMachinery();

    // Sales metrics
    let totalRevenue = 0;
    let totalTonnageDispatched = 0;
    let pendingReceivables = 0;
    let todayDispatchesCount = 0;

    const todayStr = new Date().toISOString().slice(0, 10);

    dispatches.forEach(d => {
      totalRevenue += d.finalAmount || 0;
      totalTonnageDispatched += d.netWeightMT || 0;
      if (d.paymentStatus === 'Pending') {
        pendingReceivables += (d.finalAmount - (d.paidAmount || 0));
      } else if (d.paymentStatus === 'Partial') {
        pendingReceivables += (d.finalAmount - (d.paidAmount || 0));
      }

      const dispatchDateStr = new Date(d.dispatchedAt).toISOString().slice(0, 10);
      if (dispatchDateStr === todayStr) {
        todayDispatchesCount++;
      }
    });

    // Inventory metrics
    let totalStockMT = 0;
    const lowStockAlerts = [];
    inventory.forEach(item => {
      totalStockMT += item.currentStockMT || 0;
      if (item.currentStockMT <= item.reorderLevelMT) {
        lowStockAlerts.push({
          id: item._id,
          name: item.name,
          currentStockMT: item.currentStockMT,
          reorderLevelMT: item.reorderLevelMT,
          bayLocation: item.bayLocation
        });
      }
    });

    // Machinery metrics
    const operationalCount = machinery.filter(m => m.status === 'Running').length;
    const maintenanceCount = machinery.filter(m => m.status === 'Maintenance' || m.status === 'Breakdown').length;
    const totalFuelToday = machinery.reduce((sum, m) => sum + (m.fuelConsumedLitersToday || 0), 0);

    // Aggregate distribution by category
    const categoryBreakdown = {};
    inventory.forEach(item => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.currentStockMT;
    });

    // Recent 5 dispatches
    const recentDispatches = dispatches.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        pendingReceivables: Math.round(pendingReceivables),
        totalTonnageDispatched: parseFloat(totalTonnageDispatched.toFixed(2)),
        totalStockMT: parseFloat(totalStockMT.toFixed(2)),
        totalEmployees: employees.length,
        todayDispatchesCount,
        machineryStatus: {
          running: operationalCount,
          maintenance: maintenanceCount,
          total: machinery.length,
          fuelConsumedLiters: totalFuelToday
        },
        lowStockAlerts,
        categoryBreakdown,
        recentDispatches
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
