# StatusMapper Single Source of Truth - Walkthrough

## ✅ Implementation Complete

This document summarizes the refactoring work to make `statusMapper.js` the **single source of truth** for all status-related logic in the ReGo Travel Management System.

---

## 📋 What Was Done

### 1️⃣ StatusMapper.js - Enhanced

Completely refactored with a centralized `STATUS_CONFIG` object containing:

| Property | Description |
|----------|-------------|
| `label`, `shortLabel` | Display text |
| `color`, `bgColor`, `muiColor` | UI styling |
| `stage`, `stepNumber` | Timeline/stepper config |
| `ownerRoleId` | Who acts on this status |
| `actions[roleId]` | Allowed actions per role |
| `nextStatuses[action]` | Next status after action |
| `canEmployeeUpload` | Document upload permission |
| `priorityBadge` | Travel Desk badge config |

**New API Functions Added:**
- `getStatusConfig(statusId)` → Full status configuration
- `getRoleActions(statusId, roleId)` → Actions for role at status
- `canPerformAction(statusId, roleId, action)` → Permission check
- `getNextStatusForAction(statusId, action)` → Workflow routing
- `canEmployeeUploadDocuments(statusId)` → Upload permission
- `getPriorityBadge(statusId)` → Travel Desk badge

---

### 2️⃣ Status Codes Reference

| Code | Key | Label | Owner | Employee Upload |
|------|-----|-------|-------|-----------------|
| 1 | INITIAL_MANAGER_INITIATED | Pending Manager Approval | Manager | ❌ |
| 2 | INITIAL_AVP_DVP_INITIATED | Pending AVP/DVP Approval | AVP | ❌ |
| 3 | INITIAL_SVP_INITIATED | Pending SVP Approval | SVP | ❌ |
| 4 | INITIAL_MANAGER_APPROVED | Manager Approved | Manager | ❌ |
| 5 | INITIAL_AVP_DVP_APPROVED | AVP/DVP Approved | AVP | ❌ |
| 6 | INITIAL_SVP_APPROVED | SVP Approved (Tentative) | Helpdesk | ❌ |
| 7 | MANAGER_FINAL_INITIATED | Final Manager Review | Manager | ❌ |
| 8 | AVP_DVP_FINAL_INITIATED | Final AVP/DVP Review | AVP | ❌ |
| 9 | SVP_FINAL_INITIATED | Final SVP Review | SVP | ❌ |
| 10 | FINAL_MANAGER_APPROVED | Final Manager Approved | Helpdesk | ❌ |
| 11 | FINAL_AVP_DVP_APPROVED | Final AVP/DVP Approved | Helpdesk | ❌ |
| 12 | FINAL_SVP_APPROVED | Final SVP Approved | Helpdesk | ❌ |
| **13** | **DOCUMENT_PENDING_FROM_EMPLOYEE** | **Documents Required** | **Employee** | **✅** |
| 14 | DOCUMENT_REVIEW_PENDING | Docs Under Review | Helpdesk | ❌ |
| 15 | PENDING_TICKETS | Pending Flight/Hotel | Helpdesk | ❌ |
| 16 | TICKETS_UPLOADED | Tickets Uploaded | Helpdesk | ❌ |
| 17 | EMPLOYEE_TRAVEL_COMPLETED | Completed | - | ❌ |
| 18 | VISA_REJECTED | Visa Rejected | Helpdesk | ❌ |

> **Status 13 is the ONLY status where employee can upload documents**

---

### 3️⃣ Role-Action Matrix

| Status | Employee | Manager | AVP | SVP | Helpdesk |
|--------|----------|---------|-----|-----|----------|
| 1 | View | Approve/Reject | - | - | - |
| 6 | View | - | - | - | Request Docs |
| 7-9 | View | Provide Dates | Provide Dates | Provide Dates | - |
| 10-12 | View | - | - | - | Start Booking |
| **13** | **Upload/Submit** | - | - | - | View |
| 14 | View | - | - | - | Review/Upload Visa |
| 15 | View | - | - | - | Upload Tickets |
| 16 | View Details | - | - | - | Mark Complete |

---

### 4️⃣ Files Modified

````carousel
#### [statusMapper.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/utils/statusMapper.js)
- Complete rewrite with `STATUS_CONFIG` object
- 18 status configurations with full metadata
- New API functions for role-action queries
- Backward compatibility maintained
<!-- slide -->
#### [mockApi.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/services/api/mockApi.js)
- Added 7 realistic travel entries (statuses 6-17)
- Added all 12 document types
- Added passport/visa OCR mock endpoints
- Added `getAllTravelDetails`, `getTravelDetailByTId`
- LocalStorage persistence for documents
<!-- slide -->
#### [TravelDeskPortal.jsx](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/pages/Dashboard/TravelDeskPortal.jsx)
- Replaced inline PriorityBadge (~100 lines) with `getPriorityBadge()`
- Added StatusMapper imports
<!-- slide -->
#### [DashboardEmployee.jsx](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/pages/Dashboard/DashboardEmployee.jsx)
- Added new StatusMapper imports
- Uses `canEmployeeUploadDocuments()` for upload blocking
<!-- slide -->
#### [employeeService.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/services/employeeService.js)
- Replaced local `TRAVEL_STATUS_LABELS` with `getStatusLabel()`
<!-- slide -->
#### [managerService.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/services/managerService.js)
- Replaced local `TRAVEL_STATUS_LABELS` with `getStatusLabel()`
<!-- slide -->
#### [apiConfig.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/config/apiConfig.js)
- Removed outdated `TRAVEL_STATUS` (0-4 codes)
- Added comment pointing to StatusMapper
````

---

### 5️⃣ Mock vs Real API Parity

| Feature | Mock API | Real API |
|---------|----------|----------|
| Response shape | `{ status: 'Success', result: data }` | ✅ Same |
| Status codes | 1-18 | ✅ Aligned |
| Document types | 12 (all) | ✅ Same |
| Passport OCR | ✅ Mock generation | ✅ Backend OCR |
| Visa OCR | ✅ Mock generation | ✅ Backend OCR |
| Travel endpoints | Full CRUD | ✅ Same |

**Toggle:** Set `USE_MOCK_API = true/false` in [apiConfig.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/config/apiConfig.js)

---

### 6️⃣ Document Dashboard Changes

**Submit Button Logic (already in place):**
```javascript
const canSubmitDocuments = allRequiredUploaded && isPassportVerified;
// On submit → status moves to 14
```

**Upload Blocking:**
```javascript
import { canEmployeeUploadDocuments } from '../utils/statusMapper';
const canUpload = canEmployeeUploadDocuments(currentStatus);
// Returns true ONLY when status === 13
```

---

### 7️⃣ Build Verification

```
✅ npm run build - Exit code: 0
✅ Bundle size: 358.68 kB (gzipped)
⚠️ Lint warnings: Unused imports only (no errors)
```

---

## 🔄 How to Use StatusMapper

```javascript
import { 
  getStatusConfig,
  getRoleActions,
  canEmployeeUploadDocuments,
  getPriorityBadge,
  STATUS_CODES
} from '../utils/statusMapper';

// Get full config
const config = getStatusConfig(13);
// → { label: 'Documents Required', actions: { 101: ['UPLOAD_DOCUMENTS', 'SUBMIT_DOCUMENTS'] }, ... }

// Check if employee can upload
const canUpload = canEmployeeUploadDocuments(13); // → true
const canUpload = canEmployeeUploadDocuments(14); // → false

// Get actions for helpdesk at status 14
const actions = getRoleActions(14, 103); 
// → ['REVIEW_DOCUMENTS', 'UPLOAD_VISA', 'SUBMIT_TO_MANAGER', 'REJECT_VISA']

// Get Travel Desk priority badge
const badge = getPriorityBadge(14);
// → { icon: 'Description', label: 'Upload Visa & Appointment', bg: '#fef3c7', ... }
```

---

## 📝 What Each Role Sees & Can Do

### Employee (Role 101)
- Views request status across all stages
- **Status 13**: Can upload documents + Submit button
- Cannot raise requests (Manager initiates)

### Manager/AVP/SVP (Roles 102, 104, 105)
- **Status 1-3**: Approve/Reject initial request
- **Status 7-9**: Provide final travel dates

### Helpdesk (Role 103)
- **Status 6**: Request documents from employee
- **Status 14**: Upload Visa, Visa Appointment; Submit to Manager for final dates
- **Status 15**: Upload Hotel/Flight/Insurance bookings
- **Status 16**: Mark travel as completed

---

## ✅ Confirmation

| Item | Status |
|------|--------|
| StatusMapper = Single Source of Truth | ✅ |
| Mock API matches Real API shape | ✅ |
| Employee upload blocked outside status 13 | ✅ |
| Submit moves to status 14 | ✅ |
| Travel Desk uses StatusMapper | ✅ |
| Build passes | ✅ |
