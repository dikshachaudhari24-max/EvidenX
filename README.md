# EvidenX — Forensic Evidence Management System

## Overview
EvidenX is a full-stack forensic digital evidence management system with:
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Backend**: Node.js + Express REST API
- **Database**: MySQL (evidence_vault)

---

## Prerequisites
- **Node.js** v18+ installed
- **MySQL** 8.0+ installed (via MySQL Workbench or CLI)
- **npm** package manager

---

## 1. Database Setup (MySQL Workbench)

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Click on your **Local instance** connection (usually `localhost:3306`)
3. Enter your root password when prompted

### Step 2: Run the SQL files **in this exact order**
1. Open a new SQL script tab: `File → New Query Tab` (or Ctrl+T)
2. Run each file one at a time by opening it (`File → Open SQL Script`) and clicking the **lightning bolt** (⚡) Execute button:

   | Order | File | Purpose |
   |-------|------|---------|
   | 1 | `database/schema.sql` | Creates the database and all 6 tables |
   | 2 | `database/views.sql` | Creates 3 SQL views |
   | 3 | `database/triggers.sql` | Creates 4 triggers |
   | 4 | `database/seed_data.sql` | Inserts realistic test data |

### Step 3: Verify setup
In the **left sidebar** (Navigator → Schemas), click the refresh icon (🔄) and expand `evidence_vault`:

- **Tables** (6): `Actor`, `Evidence`, `Evidence_Version`, `Custody_Event`, `Access_Log`, `Integrity_Audit`
- **Views** (3): `vw_evidence_summary`, `vw_custody_chain`, `vw_integrity_status`

To verify triggers, run:
```sql
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'evidence_vault';
```

You should see 4 triggers:
- `trg_auto_audit_on_version_insert`
- `trg_log_access_on_custody_event`
- `trg_flag_hash_mismatch`
- `trg_prevent_evidence_delete`

### Step 4: Test triggers manually

**Test trg_prevent_evidence_delete** (should fail — evidence has custody events):
```sql
USE evidence_vault;
DELETE FROM Evidence WHERE evidence_id = 'e1000000-0000-0000-0000-000000000001';
-- Expected: Error 1644 "CANNOT DELETE: This evidence has custody events..."
```

**Test trg_auto_audit_on_version_insert** (should auto-create audit record):
```sql
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes)
VALUES (UUID(), 'e1000000-0000-0000-0000-000000000001', 99, 'test_hash_value', NOW(), 'Test version');
-- Then check: SELECT * FROM Integrity_Audit ORDER BY audit_time DESC LIMIT 1;
```

**Test trg_log_access_on_custody_event** (should auto-create access log):
```sql
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time)
VALUES (UUID(), 'v1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'received', 'Test Lab', 'Test', NOW());
-- Then check: SELECT * FROM Access_Log ORDER BY access_time DESC LIMIT 1;
```

---

## 2. Backend Setup

### Step 1: Configure environment
Edit `backend/.env` and set your MySQL password:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=evidence_vault
PORT=5000
```

### Step 2: Install dependencies and start
```bash
cd backend
npm install
node app.js
```

You should see: `EvidenX API running on http://localhost:5000`

### Step 3: Test the API
Open a browser and visit: `http://localhost:5000/api/health`
You should see: `{"status":"ok","timestamp":"..."}`

---

## 3. Frontend Setup

### Step 1: Install and start
```bash
cd frontend
npm install
npm run dev
```

### Step 2: Open the app
Visit `http://localhost:3000` (frontend runs on port 3000, backend on port 5000).

### Login credentials:
| Email | Password | Role |
|-------|----------|------|
| admin@evidenx.com | admin123 | Admin |
| investigator@evidenx.com | inv123 | Investigator |
| user@evidenx.com | user123 | User |

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/evidence` | List all evidence |
| GET | `/api/evidence/:id` | Get evidence with versions |
| POST | `/api/evidence` | Create evidence |
| PUT | `/api/evidence/:id` | Update evidence |
| DELETE | `/api/evidence/:id` | Delete evidence (trigger-protected) |
| GET | `/api/versions/evidence/:id` | Get versions for evidence |
| POST | `/api/versions` | Create new version |
| GET | `/api/custody` | List custody events |
| GET | `/api/custody/evidence/:id` | Custody chain for evidence |
| POST | `/api/custody` | Log custody event |
| GET | `/api/accesslog` | List access logs |
| GET | `/api/accesslog/version/:id` | Access logs by version |
| DELETE | `/api/accesslog/:id` | Delete log entry |
| GET | `/api/actors` | List actors |
| GET | `/api/actors/:id` | Get actor details |
| POST | `/api/actors` | Create actor |
| PUT | `/api/actors/:id` | Update actor |
| DELETE | `/api/actors/:id` | Delete actor |
| GET | `/api/audit` | List audit records |
| GET | `/api/audit/evidence/:id` | Audit history for evidence |
| POST | `/api/audit/run` | Manual audit check |
| POST | `/api/audit/batch` | Batch audit all evidence |
| GET | `/api/views/evidence-summary` | Run vw_evidence_summary |
| GET | `/api/views/custody-chain` | Run vw_custody_chain |
| GET | `/api/views/integrity-status` | Run vw_integrity_status |
