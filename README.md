# 🚜 Titan Crusher ERP — Stone Quarry & Aggregate Operations System

> **A production-ready Enterprise Resource Planning (ERP) platform designed for Stone Crusher Plants, Blue Metal Quarries, M-Sand Washing Units, and Heavy Fleet Logistics.**

Built with **React (Vite + Tailwind CSS), Node.js (Express), MongoDB (Mongoose with auto In-Memory Dual Engine), and RESTful APIs** with strict **Role-Based Access Control (RBAC)**.

---

## 🌟 Key Features

### 1. ⚖️ Electronic Weighbridge & Sales Dispatch
- **Automated Weighment Calculation**: Real-time Gross Weight (loaded) and Tare Weight (empty) input with instantaneous certified **Net Weight (MT)** calculation.
- **Delivery Challan & Gate Pass Generation**: Generates official print-ready Gate Passes and Delivery Challans with GSTIN, quarry permit numbers, vehicle numbers, consignee details, and signature zones.
- **Flexible Billing**: Automated 5% royalty/GST tax computation, payment modes (UPI/QR, Cash, Bank RTGS/NEFT, Credit Terms), and status tracking (Paid, Partial, Pending).

### 2. 📦 Stockpile & Aggregate Inventory Management
- **Quarry Product Catalog**: Complete tracking for 9 aggregate grades:
  - 20mm Crushed Metal (RMC / Concrete slab aggregate)
  - 10mm Aggregate Chips (Pumpable concrete & precast)
  - 40mm Ballast Stone (Foundations & railway ballast)
  - M-Sand (Manufactured Concrete Sand Zone-II)
  - P-Sand (Plastering Fine Sand)
  - GSB (Granular Sub Base for Highways)
  - WMM (Wet Mix Macadam)
  - Raw Basalt Quarry Pit Feed Boulders
  - Stone Dust / Quarry Dust (0-2mm)
- **Stock Health & Reorder Alerts**: Automatic alerts when bay stockpile falls below minimum tonnage.
- **Bay Location Mapping**: Track North Yard, West Yard, Washing Sheds, and Pit Feed stockpiles.

### 3. 👷 Workforce Muster Roll & Daily Wage Payroll
- **Staff Roster**: Track Quarry Blasters, Crusher Operators, Weighbridge Clerks, Excavator Pilots, and Mechanics.
- **Daily Attendance Marking**: 1-click muster marking (`Present`, `Absent`, `Half-Day`, `Overtime +2h/+3h`).
- **Automated Payroll**: Auto-computes base pay, overtime pay (1.5x hourly rate), and net salary payable.

### 4. 🚜 Heavy Machinery & Diesel Fuel Monitoring
- **Plant Equipment Logs**: Status of Primary Jaw Crusher, Secondary Cone Crusher, VSI Sand Maker, Triple-deck Vibrating Screens, Caterpillar Loaders, and Diesel Gensets.
- **Fuel Tracking**: Daily High Speed Diesel (HSD) consumption log per machine.
- **Maintenance Alerts**: Operating hour countdown towards scheduled service intervals.

### 5. 📊 Real-time Executive Control Dashboard
- Real-time KPIs: Today's Revenue, Dispatched Tonnage (MT), Active Trucks, Inventory Valuation, and Pending Receivables.
- Interactive category stock capacity breakdown.
- Live weighbridge stream with gate pass inspection.

### 6. 🔐 Authentication & Role-Based Access Control (RBAC)
- Secure JWT authentication with bcrypt password hashing.
- Four distinct role permission profiles:
  - **Admin**: Full master control (billing, inventory creation, user administration).
  - **Manager**: Operations supervision, stock updates, employee muster, machinery logs.
  - **Operator**: Weighbridge station, vehicle in/out weighing, and Gate Pass generation.
  - **Accountant**: Financial audits, payment reconciliations, and payroll wage sheets.

---

## 🔑 Demo Access Credentials (1-Click Switcher Available in UI)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@crusher.com` | `admin123` | Master access across all modules & settings |
| **Manager** | `manager@crusher.com` | `manager123` | Inventory, Dispatches, Workforce, Machinery |
| **Operator** | `weighbridge@crusher.com` | `operator123` | Weighbridge gross/tare entry & Gate Passes |
| **Accountant** | `accountant@crusher.com` | `account123` | Invoices, credit ledger, tax reports, payroll |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express.js REST API.
- **Database**: MongoDB with Mongoose + Embedded Dual In-Memory Failover Engine (runs zero-config out of the box even without local MongoDB installed).
- **Security**: JWT (JSON Web Tokens), bcryptjs password hashing, CORS, input sanitization.
- **Deployment**: Ready for Railway, Vercel, Docker, and Render.

---

## 🚀 Quick Start (Local Run)

### Prerequisites
- Node.js (v18+)
- (Optional) MongoDB running on `mongodb://localhost:27017/crusher_erp` (if not running, the system automatically uses its high-speed in-memory store with seeded datasets).

### 1. Run the Backend
```bash
cd backend
npm install
node server.js
```
The backend API starts on `http://localhost:5000`.

### 2. Run the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## ☁️ Deployment Guides

### 🚂 Deploying on Railway
1. Install Railway CLI or link your GitHub repository on [railway.app](https://railway.app).
2. To deploy via CLI:
   ```bash
   railway login
   railway init
   railway up
   ```
3. Set environment variables on Railway dashboard:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string (or use Railway MongoDB plugin)
   - `JWT_SECRET`: `your_random_secret_key`

### ▲ Deploying on Vercel
1. Run `vercel login` and authenticate your account.
2. In the `crusher-erp` directory, run:
   ```bash
   vercel --prod
   ```

---

## 📡 REST API Reference

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticate user & retrieve JWT token |
| `/api/auth/register` | `POST` | Public | Register new plant personnel |
| `/api/auth/me` | `GET` | Authenticated | Retrieve current user profile |
| `/api/dashboard/stats` | `GET` | Authenticated | Aggregate KPIs, revenue, and alerts |
| `/api/inventory` | `GET` | Authenticated | List all crushed stone & sand stocks |
| `/api/inventory` | `POST` | Admin, Manager | Add new aggregate grade |
| `/api/inventory/:id` | `PUT` | Admin, Manager | Update stock tonnage or unit price |
| `/api/inventory/:id` | `DELETE`| Admin | Delete aggregate item |
| `/api/sales` | `GET` | Authenticated | List weighbridge dispatches & challans |
| `/api/sales` | `POST` | Admin, Manager, Operator | Record vehicle weighment & deduct stock |
| `/api/sales/:id` | `PUT` | Admin, Manager, Accountant | Mark invoice as Paid / update details |
| `/api/employees` | `GET` | Authenticated | Workforce roster |
| `/api/employees` | `POST` | Admin, Manager | Register new employee |
| `/api/employees/attendance` | `POST` | Admin, Manager | Mark daily attendance and overtime |
| `/api/employees/payroll` | `GET` | Admin, Manager, Accountant | Auto-calculated wage summary |
| `/api/machinery` | `GET` | Authenticated | Plant equipment & diesel telemetry |
| `/api/machinery/:id` | `PUT` | Admin, Manager, Operator | Update running hours & fuel consumption |
