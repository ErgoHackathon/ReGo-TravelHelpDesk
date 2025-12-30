# Status Mapper Single Source of Truth - Implementation Plan

## Goal

Transform `statusMapper.js` into a **single source of truth** that drives ALL status-related logic across the application. UI components will query the StatusMapper for:
- Status labels, colors, descriptions
- Allowed actions per role
- Next possible statuses
- Step configuration for timelines
- Document requirements

---

## Proposed Changes

### 1️⃣ StatusMapper Enhancement

#### [MODIFY] [statusMapper.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/utils/statusMapper.js)

**Current State:**
- Has `STATUS_CODES` (1-18), `ROLE_IDS`, `DOCUMENT_GROUPS`
- Has `statusToChip()` returning label/color/bgColor
- Has helper functions: `canUploadDocuments()`, `getAvailableActions()`, etc.

**What Changes:**

1. **Add Comprehensive STATUS_CONFIG Object** - Central configuration for each status:
```javascript
const STATUS_CONFIG = {
  1: {
    key: 'INITIAL_MANAGER_INITIATED',
    label: 'Pending Manager Approval',
    shortLabel: 'Manager Initiated',
    color: '#d97706',
    bgColor: '#fff3e0',
    muiColor: 'warning',
    description: 'Request initiated, awaiting manager approval',
    stage: 'initial_approval',
    stepNumber: 1,
    ownerRoleId: 102, // Manager owns this status
    actions: {
      102: ['APPROVE', 'REJECT'], // Manager can approve/reject
    },
    nextStatuses: {
      APPROVE: 4, // Moves to INITIAL_MANAGER_APPROVED
      REJECT: null, // Stays (with rejection flag)
    },
    canEmployeeView: true,
    canEmployeeUpload: false,
    requiresDocuments: false,
  },
  // ... similar for all 18 statuses
};
```

2. **Add New API Functions:**
```javascript
// Get complete config for a status
export const getStatusConfig = (statusId) => STATUS_CONFIG[statusId] || UNKNOWN_STATUS;

// Get actions available for a role at a status
export const getRoleActions = (statusId, roleId) => {
  const config = STATUS_CONFIG[statusId];
  return config?.actions?.[roleId] || [];
};

// Check if role can perform specific action
export const canPerformAction = (statusId, roleId, action) => {
  const actions = getRoleActions(statusId, roleId);
  return actions.includes(action);
};

// Get next status after an action
export const getNextStatus = (statusId, action) => {
  const config = STATUS_CONFIG[statusId];
  return config?.nextStatuses?.[action] || null;
};

// Check if employee can upload at this status
export const canEmployeeUploadDocuments = (statusId) => {
  return STATUS_CONFIG[statusId]?.canEmployeeUpload === true;
};

// Get all statuses visible in timeline
export const getTimelineSteps = () => [ ... ];
```

---

### 2️⃣ DashboardEmployee.jsx Changes

#### [MODIFY] [DashboardEmployee.jsx](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/pages/Dashboard/DashboardEmployee.jsx)

**What Changes:**

1. **Replace `canUploadDocuments()` check** with `statusMapper.canEmployeeUploadDocuments(statusId)`
2. **Submit Documents Logic:**
   - Enabled only when `allRequiredUploaded && isPassportVerified`
   - On submit, move to status 14 via `submitDocumentsThunk`
   - Show clear error messages when incomplete
3. **Block document upload** outside status 13 using StatusMapper check
4. **Remove hardcoded status numbers** - use `STATUS_CODES.DOCUMENT_PENDING_FROM_EMPLOYEE`

---

### 3️⃣ TravelDeskPortal.jsx Changes

#### [MODIFY] [TravelDeskPortal.jsx](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/pages/Dashboard/TravelDeskPortal.jsx)

**What Changes:**

1. **Replace inline PriorityBadge mapping** with `statusMapper.getStatusConfig(statusId)`
2. **Replace `getActionButton()` hardcoded statuses** with:
```javascript
const actions = statusMapper.getRoleActions(statusId, ROLE_IDS.HELPDESK);
// Render buttons based on actions array
```
3. **Replace status filtering logic** with `statusMapper.isInStatusGroup()` calls
4. **StatusChipMapped** stays (already uses `statusToChip`)

---

### 4️⃣ Mock API Parity

#### [MODIFY] [mockApi.js](file:///c:/Users/Dell/Downloads/ReGo-TravelHelpDesk/frontend/src/services/api/mockApi.js)

**What Changes:**

1. **Add mock travels with realistic status distribution** (statuses 1-17)
2. **Add `tId` to travels** (travel ID for consistent referencing)
3. **Add `getAllTravelDetails()` endpoint**:
```javascript
getAllTravelDetails: async () => {
  await delay(300);
  return { status: 'Success', result: mockDB.travels };
}
```
4. **Add `getTravelDetailByTId(tId)` endpoint**
5. **Update `updateTravelStatus(tId, status, empId, comment)`** to match backend signature
6. **Response shape matches backend:**
```javascript
{ status: 'Success', result: data }
{ status: 'Functional Failure', result: null }
```

---

### 5️⃣ Cleanup

#### [DELETE or MODIFY] Redundant Files

- `config/apiConfig.js` - Remove `TRAVEL_STATUS` and `TRAVEL_STATUS_LABELS` (uses old 0-4 codes)
- `utils/statusMapping.js` - Remove if unused
- `config/temp.js` - Remove if experimental

---

## Verification Plan

### Manual Testing (No automated tests exist)

**Since this is a frontend React application without existing tests, verification will be manual:**

1. **Login as Employee (abhishek.kumar@demo.com / Pass@123)**
   - Verify status 13 request shows "Upload Documents" button enabled
   - Upload required documents
   - Verify Submit button becomes enabled after all required docs + passport verification
   - Click Submit → verify status changes to 14
   - Verify cannot upload documents when status is NOT 13

2. **Login as Travel Desk (vikram.singh@demo.com / Vikram@123)**
   - Verify pending requests table shows correct status labels/colors
   - Verify action buttons match current status (e.g., "Request Documents" for status 6)
   - Click action → verify status changes correctly
   - Verify completed bookings table (status 16, 17)

3. **Mock API Verification**
   - Set `USE_MOCK_API = true` in apiConfig.js
   - Repeat above flows
   - Verify mock responses match real API structure
   - Check localStorage persistence works

4. **Console Verification**
   - No errors related to status mapping
   - No "undefined" status labels
   - Status transitions log correctly

> [!IMPORTANT]
> **User Manual Testing Required**: After implementation, user should test in office with real backend to confirm mock/real parity.

---

## Status Codes Reference (Backend-Aligned)

| Code | Key | Label | Owner Role | Employee Can Upload |
|------|-----|-------|------------|---------------------|
| 1 | INITIAL_MANAGER_INITIATED | Pending Manager Approval | Manager (102) | No |
| 2 | INITIAL_AVP_DVP_INITIATED | Pending AVP/DVP Approval | AVP (104) | No |
| 3 | INITIAL_SVP_INITIATED | Pending SVP Approval | SVP (105) | No |
| 4 | INITIAL_MANAGER_APPROVED | Manager Approved | Manager (102) | No |
| 5 | INITIAL_AVP_DVP_APPROVED | AVP/DVP Approved | AVP (104) | No |
| 6 | INITIAL_SVP_APPROVED | SVP Approved | SVP (105) | No |
| 7 | MANAGER_FINAL_INITIATED | Final Manager Review | Manager (102) | No |
| 8 | AVP_DVP_FINAL_INITIATED | Final AVP/DVP Review | AVP (104) | No |
| 9 | SVP_FINAL_INITIATED | Final SVP Review | SVP (105) | No |
| 10 | FINAL_MANAGER_APPROVED | Final Manager Approved | Manager (102) | No |
| 11 | FINAL_AVP_DVP_APPROVED | Final AVP/DVP Approved | AVP (104) | No |
| 12 | FINAL_SVP_APPROVED | Final SVP Approved | SVP (105) | No |
| 13 | DOCUMENT_PENDING_FROM_EMPLOYEE | Documents Required | **Employee (101)** | **Yes** |
| 14 | DOCUMENT_REVIEW_PENDING_FROM_HELPDESK | Documents Under Review | Helpdesk (103) | No |
| 15 | PENDING_TICKETS_FROM_HELPDESK | Pending Flight/Hotel | Helpdesk (103) | No |
| 16 | TICKETS_UPLOADED_FROM_HELPDESK | Tickets Uploaded | Helpdesk (103) | No |
| 17 | EMPLOYEE_TRAVEL_COMPLETED | Travel Completed | - | No |
| 18 | VISA_REJECTED | Visa Rejected | Helpdesk (103) | No |

---

## Files Changed Summary

| File | Action | Description |
|------|--------|-------------|
| `utils/statusMapper.js` | MODIFY | Add STATUS_CONFIG, new API functions |
| `pages/Dashboard/DashboardEmployee.jsx` | MODIFY | Use StatusMapper for upload/submit logic |
| `pages/Dashboard/TravelDeskPortal.jsx` | MODIFY | Replace hardcoded status mappings |
| `services/api/mockApi.js` | MODIFY | Add missing endpoints, realistic mock data |
| `config/apiConfig.js` | MODIFY | Remove outdated TRAVEL_STATUS |
