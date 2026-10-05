import bcrypt from 'bcryptjs';

export const getInitialData = async () => {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const managerPassword = await bcrypt.hash('manager123', salt);
  const operatorPassword = await bcrypt.hash('operator123', salt);
  const accountantPassword = await bcrypt.hash('account123', salt);

  const users = [
    {
      _id: 'usr_001',
      name: 'Rajesh Sharma',
      email: 'admin@crusher.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98230 11223',
      createdAt: new Date('2026-01-10')
    },
    {
      _id: 'usr_002',
      name: 'Vikram Patil',
      email: 'manager@crusher.com',
      password: managerPassword,
      role: 'manager',
      phone: '+91 97654 33211',
      createdAt: new Date('2026-01-15')
    },
    {
      _id: 'usr_003',
      name: 'Amit Deshmukh',
      email: 'weighbridge@crusher.com',
      password: operatorPassword,
      role: 'operator',
      phone: '+91 94220 77889',
      createdAt: new Date('2026-02-01')
    },
    {
      _id: 'usr_004',
      name: 'Pooja Kulkarni',
      email: 'accountant@crusher.com',
      password: accountantPassword,
      role: 'accountant',
      phone: '+91 98900 44556',
      createdAt: new Date('2026-02-10')
    }
  ];

  const inventories = [
    {
      _id: 'inv_001',
      name: '20mm Crushed Metal (Standard Aggregate)',
      code: 'AGG-20MM',
      category: 'Aggregate',
      currentStockMT: 1420.50,
      reorderLevelMT: 200,
      unitPricePerMT: 680,
      bayLocation: 'Bay 1 (North Yard)',
      description: 'Standard 20mm blue metal aggregate for RMC (Ready Mix Concrete) and slab casting.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_002',
      name: '10mm Crushed Aggregate (Chips)',
      code: 'AGG-10MM',
      category: 'Aggregate',
      currentStockMT: 890.00,
      reorderLevelMT: 150,
      unitPricePerMT: 740,
      bayLocation: 'Bay 2 (North Yard)',
      description: '10mm chips used in high grade pumpable concrete, precast blocks, and road sealing.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_003',
      name: '40mm Crushed Stone (Ballast)',
      code: 'AGG-40MM',
      category: 'Aggregate',
      currentStockMT: 2150.00,
      reorderLevelMT: 300,
      unitPricePerMT: 580,
      bayLocation: 'Bay 3 (West Yard)',
      description: '40mm coarse stone for heavy foundations, mass concrete, and railway track ballast.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_004',
      name: 'M-Sand (Manufactured Concrete Sand 0-4mm)',
      code: 'SND-MSAND',
      category: 'Sand',
      currentStockMT: 3200.75,
      reorderLevelMT: 400,
      unitPricePerMT: 850,
      bayLocation: 'Shed C (Washed Zone)',
      description: 'Triple-washed manufactured sand with cubical shape conforming to IS 383 Zone II.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_005',
      name: 'P-Sand (Plastering Sand 0-2.36mm)',
      code: 'SND-PSAND',
      category: 'Sand',
      currentStockMT: 760.20,
      reorderLevelMT: 100,
      unitPricePerMT: 920,
      bayLocation: 'Shed D (Fine Screen)',
      description: 'Fine grade plastering sand with silt separator for smooth wall plastering.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_006',
      name: 'GSB (Granular Sub-Base Mix)',
      code: 'BASE-GSB',
      category: 'Base Material',
      currentStockMT: 4800.00,
      reorderLevelMT: 500,
      unitPricePerMT: 450,
      bayLocation: 'Open Yard E',
      description: 'MORTH certified granular sub base mixture for highway and arterial road foundations.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_007',
      name: 'WMM (Wet Mix Macadam Mix)',
      code: 'BASE-WMM',
      category: 'Base Material',
      currentStockMT: 1680.00,
      reorderLevelMT: 250,
      unitPricePerMT: 520,
      bayLocation: 'Plant Mixer Bin 2',
      description: 'Premixed graded stone aggregate with binder moisture control for road pavement base.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_008',
      name: 'Raw Basalt Quarry Boulders (Feed Stock)',
      code: 'RAW-BOULDER',
      category: 'Raw Boulder',
      currentStockMT: 6500.00,
      reorderLevelMT: 1000,
      unitPricePerMT: 310,
      bayLocation: 'Quarry Pit Head Stockpile',
      description: 'Blasted rock feed boulders (300mm-600mm) waiting for primary jaw crusher intake.',
      updatedAt: new Date()
    },
    {
      _id: 'inv_009',
      name: 'Stone Dust / Quarry Dust (0-2mm)',
      code: 'DST-DUST',
      category: 'Dust',
      currentStockMT: 940.00,
      reorderLevelMT: 120,
      unitPricePerMT: 380,
      bayLocation: 'Screen Bay 4',
      description: 'Quarry dust by-product used in paver blocks, pipe bedding, and subgrade stabilization.',
      updatedAt: new Date()
    }
  ];

  const dispatches = [
    {
      _id: 'disp_001',
      challanNo: 'CH-2026-1041',
      customerName: 'National Highway Infra Ltd',
      customerPhone: '+91 98221 44550',
      vehicleNo: 'MH-12-RN-4890',
      driverName: 'Sanjay Jadhav',
      driverPhone: '+91 97631 22100',
      productName: 'GSB (Granular Sub-Base Mix)',
      productId: 'inv_006',
      grossWeightMT: 42.80,
      tareWeightMT: 12.40,
      netWeightMT: 30.40,
      ratePerMT: 450,
      taxPercent: 5,
      subTotal: 13680,
      taxAmount: 684,
      finalAmount: 14364,
      paymentStatus: 'Paid',
      paidAmount: 14364,
      paymentMode: 'Bank Transfer',
      gatePassStatus: 'Dispatched',
      operatorName: 'Amit Deshmukh',
      notes: 'Highway package 4 bypass widening site',
      dispatchedAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      _id: 'disp_002',
      challanNo: 'CH-2026-1042',
      customerName: 'Apex ReadyMix Concrete',
      customerPhone: '+91 99700 88991',
      vehicleNo: 'MH-14-CW-7721',
      driverName: 'Ramesh Pawar',
      driverPhone: '+91 98501 33299',
      productName: '20mm Crushed Metal (Standard Aggregate)',
      productId: 'inv_001',
      grossWeightMT: 46.50,
      tareWeightMT: 14.10,
      netWeightMT: 32.40,
      ratePerMT: 680,
      taxPercent: 5,
      subTotal: 22032,
      taxAmount: 1101.6,
      finalAmount: 23133.6,
      paymentStatus: 'Paid',
      paidAmount: 23133.6,
      paymentMode: 'UPI/Online',
      gatePassStatus: 'Dispatched',
      operatorName: 'Amit Deshmukh',
      notes: 'M30 Grade batching plant requirement',
      dispatchedAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      _id: 'disp_003',
      challanNo: 'CH-2026-1043',
      customerName: 'Metro Urban Developers',
      customerPhone: '+91 91580 66772',
      vehicleNo: 'MH-09-EM-3012',
      driverName: 'Govind Shinde',
      driverPhone: '+91 94210 99881',
      productName: 'M-Sand (Manufactured Concrete Sand 0-4mm)',
      productId: 'inv_004',
      grossWeightMT: 38.60,
      tareWeightMT: 11.80,
      netWeightMT: 26.80,
      ratePerMT: 850,
      taxPercent: 5,
      subTotal: 22780,
      taxAmount: 1139,
      finalAmount: 23919,
      paymentStatus: 'Pending',
      paidAmount: 0,
      paymentMode: 'Credit',
      gatePassStatus: 'Dispatched',
      operatorName: 'Amit Deshmukh',
      notes: 'Commercial complex tower slab - 15 days credit terms',
      dispatchedAt: new Date(Date.now() - 3600000 * 9)
    },
    {
      _id: 'disp_004',
      challanNo: 'CH-2026-1044',
      customerName: 'Shree Sai Infrastructure',
      customerPhone: '+91 98812 33445',
      vehicleNo: 'MH-11-AA-6540',
      driverName: 'Sunil Gaikwad',
      driverPhone: '+91 97664 12389',
      productName: '10mm Crushed Aggregate (Chips)',
      productId: 'inv_002',
      grossWeightMT: 35.20,
      tareWeightMT: 10.90,
      netWeightMT: 24.30,
      ratePerMT: 740,
      taxPercent: 5,
      subTotal: 17982,
      taxAmount: 899.1,
      finalAmount: 18881.1,
      paymentStatus: 'Partial',
      paidAmount: 10000,
      paymentMode: 'Cash',
      gatePassStatus: 'Dispatched',
      operatorName: 'Amit Deshmukh',
      notes: 'Flyover girder precast yard',
      dispatchedAt: new Date(Date.now() - 3600000 * 18)
    },
    {
      _id: 'disp_005',
      challanNo: 'CH-2026-1045',
      customerName: 'Kalyani Precast Products',
      customerPhone: '+91 98600 55441',
      vehicleNo: 'MH-12-QZ-9912',
      driverName: 'Deepak More',
      driverPhone: '+91 99221 00213',
      productName: 'P-Sand (Plastering Sand 0-2.36mm)',
      productId: 'inv_005',
      grossWeightMT: 31.00,
      tareWeightMT: 10.20,
      netWeightMT: 20.80,
      ratePerMT: 920,
      taxPercent: 5,
      subTotal: 19136,
      taxAmount: 956.8,
      finalAmount: 20092.8,
      paymentStatus: 'Paid',
      paidAmount: 20092.8,
      paymentMode: 'Bank Transfer',
      gatePassStatus: 'Dispatched',
      operatorName: 'Amit Deshmukh',
      notes: 'Interlocking pavers block factory delivery',
      dispatchedAt: new Date(Date.now() - 3600000 * 28)
    }
  ];

  const employees = [
    {
      _id: 'emp_001',
      employeeCode: 'EMP-101',
      name: 'Balasaheb Chavan',
      designation: 'Quarry In-charge & Blasting Supervisor',
      department: 'Crusher Operations',
      phone: '+91 98223 99881',
      dailyWage: 1200,
      status: 'Active',
      joinDate: new Date('2023-03-01'),
      attendance: [
        { date: '2026-10-01', status: 'Present', overtimeHours: 2, markedBy: 'Vikram Patil' },
        { date: '2026-10-02', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-03', status: 'Present', overtimeHours: 1.5, markedBy: 'Vikram Patil' },
        { date: '2026-10-04', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-05', status: 'Present', overtimeHours: 3, markedBy: 'Vikram Patil' },
        { date: '2026-10-06', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' }
      ]
    },
    {
      _id: 'emp_002',
      employeeCode: 'EMP-102',
      name: 'Anand Shirole',
      designation: 'Jaw & Cone Crusher Lead Operator',
      department: 'Crusher Operations',
      phone: '+91 97651 88772',
      dailyWage: 1050,
      status: 'Active',
      joinDate: new Date('2023-06-15'),
      attendance: [
        { date: '2026-10-01', status: 'Present', overtimeHours: 1, markedBy: 'Vikram Patil' },
        { date: '2026-10-02', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-03', status: 'Present', overtimeHours: 2, markedBy: 'Vikram Patil' },
        { date: '2026-10-04', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-05', status: 'Present', overtimeHours: 2.5, markedBy: 'Vikram Patil' },
        { date: '2026-10-06', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' }
      ]
    },
    {
      _id: 'emp_003',
      employeeCode: 'EMP-103',
      name: 'Amit Deshmukh',
      designation: 'Senior Weighbridge Operator',
      department: 'Weighbridge',
      phone: '+91 94220 77889',
      dailyWage: 950,
      status: 'Active',
      joinDate: new Date('2024-01-10'),
      attendance: [
        { date: '2026-10-01', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-02', status: 'Present', overtimeHours: 1, markedBy: 'Vikram Patil' },
        { date: '2026-10-03', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-04', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-05', status: 'Present', overtimeHours: 1, markedBy: 'Vikram Patil' },
        { date: '2026-10-06', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' }
      ]
    },
    {
      _id: 'emp_004',
      employeeCode: 'EMP-104',
      name: 'Pravin Bhosale',
      designation: 'Wheel Loader & Heavy Excavator Pilot',
      department: 'Transport & Fleet',
      phone: '+91 91588 33441',
      dailyWage: 1100,
      status: 'Active',
      joinDate: new Date('2023-09-20'),
      attendance: [
        { date: '2026-10-01', status: 'Present', overtimeHours: 2, markedBy: 'Vikram Patil' },
        { date: '2026-10-02', status: 'Present', overtimeHours: 2, markedBy: 'Vikram Patil' },
        { date: '2026-10-03', status: 'Absent', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-04', status: 'Present', overtimeHours: 1, markedBy: 'Vikram Patil' },
        { date: '2026-10-05', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-06', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' }
      ]
    },
    {
      _id: 'emp_005',
      employeeCode: 'EMP-105',
      name: 'Santosh Jagtap',
      designation: 'Electrical & Mechanical Maintenance Lead',
      department: 'Maintenance',
      phone: '+91 98902 11990',
      dailyWage: 1150,
      status: 'Active',
      joinDate: new Date('2023-04-12'),
      attendance: [
        { date: '2026-10-01', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-02', status: 'Present', overtimeHours: 3, markedBy: 'Vikram Patil' },
        { date: '2026-10-03', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-04', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' },
        { date: '2026-10-05', status: 'Present', overtimeHours: 2, markedBy: 'Vikram Patil' },
        { date: '2026-10-06', status: 'Present', overtimeHours: 0, markedBy: 'Vikram Patil' }
      ]
    }
  ];

  const machineries = [
    {
      _id: 'mac_001',
      machineCode: 'CRUSH-JAW-01',
      name: 'Metso Nordberg C120 Primary Jaw Crusher',
      type: 'Primary Jaw Crusher',
      status: 'Running',
      operatingHoursToday: 7.5,
      fuelConsumedLitersToday: 180,
      lastServiceDate: new Date('2026-09-15'),
      nextServiceHours: 185,
      assignedOperator: 'Anand Shirole',
      healthRatingPercent: 96
    },
    {
      _id: 'mac_002',
      machineCode: 'CRUSH-CONE-02',
      name: 'Sandvik CH430 Secondary Cone Crusher',
      type: 'Cone Crusher',
      status: 'Running',
      operatingHoursToday: 6.8,
      fuelConsumedLitersToday: 140,
      lastServiceDate: new Date('2026-09-10'),
      nextServiceHours: 142,
      assignedOperator: 'Anand Shirole',
      healthRatingPercent: 92
    },
    {
      _id: 'mac_003',
      machineCode: 'VSI-SAND-03',
      name: 'Barmac B6150 Vertical Shaft Impactor (M-Sand)',
      type: 'VSI Sand Maker',
      status: 'Running',
      operatingHoursToday: 8.0,
      fuelConsumedLitersToday: 165,
      lastServiceDate: new Date('2026-09-22'),
      nextServiceHours: 210,
      assignedOperator: 'Anand Shirole',
      healthRatingPercent: 89
    },
    {
      _id: 'mac_004',
      machineCode: 'CAT-LOADER-04',
      name: 'Caterpillar 966H Wheel Loader (Aggregates Yard)',
      type: 'Wheel Loader',
      status: 'Running',
      operatingHoursToday: 6.2,
      fuelConsumedLitersToday: 110,
      lastServiceDate: new Date('2026-08-30'),
      nextServiceHours: 90,
      assignedOperator: 'Pravin Bhosale',
      healthRatingPercent: 94
    },
    {
      _id: 'mac_005',
      machineCode: 'KOMATSU-EXC-05',
      name: 'Komatsu PC300 Mining Hydraulic Excavator (Quarry Pit)',
      type: 'Excavator',
      status: 'Maintenance',
      operatingHoursToday: 2.1,
      fuelConsumedLitersToday: 45,
      lastServiceDate: new Date('2026-10-04'),
      nextServiceHours: 240,
      assignedOperator: 'Balasaheb Chavan',
      healthRatingPercent: 78
    },
    {
      _id: 'mac_006',
      machineCode: 'CUMMINS-DG-06',
      name: 'Cummins 500 kVA Heavy Industrial Diesel Genset',
      type: 'Generator / DG Set',
      status: 'Running',
      operatingHoursToday: 4.5,
      fuelConsumedLitersToday: 135,
      lastServiceDate: new Date('2026-09-28'),
      nextServiceHours: 320,
      assignedOperator: 'Santosh Jagtap',
      healthRatingPercent: 98
    }
  ];

  return { users, inventories, dispatches, employees, machineries };
};
