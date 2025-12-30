# ReGo Travel Management System - Frontend Codebase Analysis

**Analysis Date:** 2025-12-30  
**Purpose:** Complete codebase audit for safe MSW integration and refactoring

---

## 1️⃣ PROJECT STRUCTURE ANALYSIS

### **Major Folders Overview**

#### **`src/pages/` - Dashboard & UI Pages**
- **Responsibility:** Main user-facing pages and dashboards
- **Status:** ✅ Actively used
- **Contains:**
  - `Dashboard/` - 5 dashboard components (Employee, Manager, AVP/SVP/CHRO shared, Travel Desk, Application Status)
  - `Login/` - Authentication page
  - `TravelRequests/` - Travel request creation/editing
  - `auth/` - Auth-related pages (3 files)

#### **`src/services/` - API & Business Logic**
- **Responsibility:** All backend communication and business logic
- **Status:** ✅ Actively used, critical component
- **Contains:**
  - `api/mockApi.js` - Mock API implementation
  - `api/realApi.js` - Real backend API calls
  - `apiService.js` - **API SWITCHER** (Mock vs Real)
  - Service files for each module (auth, dashboard, employee, manager, document, approval, notification, travel desk, travel request)
  - `mockDataService.js` - Additional mock data (appears redundant with mockApi.js)

#### **`src/redux/` - State Management**
- **Responsibility:** Global state using Redux Toolkit
- **Status:** ✅ Actively used
- **Contains:**
  - `slices/dashboardSlice.js` - Single Redux slice managing all dashboard state (424 lines)

#### **`src/components/` - Reusable UI Components**
- **Responsibility:** Shared components (modals, buttons, cards, tables, forms)
- **Status:** ✅ Actively used
- **Contains:**
  - `shared/` - 23 shared components organized by type (avatars, buttons, cards, chips, dashboard, data-display, forms, modals, navigation, tables, typography)
  - `layout/` - 2 layout components
  - 3 modal components at root level (PassportInfoModal, PendingRequestModal, RaiseRequestModal)

#### **`src/config/` - Configuration Files**
- **Responsibility:** Centralized configuration
- **Status:** ✅ Actively used
- **Contains:**
  - `apiConfig.js` - **CRITICAL:** Central API config with `USE_MOCK_API` flag
  - `permissions.js` - Role-based access control
  - `routes.js` - Route configuration
  - `theme.js` - MUI theme
  - `animations.js` - Animation presets
  - `temp.js` - ⚠️ Potentially unused or experimental

#### **`src/utils/` - Utility Functions**
- **Responsibility:** Helper functions and constants
- **Status:** ✅ Actively used
- **Contains:**
  - `statusMapper.js` - **CRITICAL:** Status code to UI mapping (775 lines)
  - `constants.js` - Application constants (328 lines)
  - `validators.js` - Form validation
  - `helpers.js` - General helpers
  - `getActiveStep.js` - Stepper logic
  - `statusMapping.js` - Additional status mapping (may be redundant with statusMapper.js)
  - `errorhandler.js` - Error handling

#### **`src/store/` - Redux Store Setup**
- **Responsibility:** Redux store configuration
- **Status:** ✅ Actively used

#### **`src/features/` - Feature Slices**
- **Responsibility:** Additional Redux slices
- **Status:** ✅ Contains authSlice (1 file)

#### **`src/routes/` - Route Configuration**
- **Responsibility:** React Router setup
- **Status:** ✅ Actively used (1 file)

#### **`src/animations/` - Animation Assets**
- **Responsibility:** Lottie/animation files
- **Status:** ✅ Actively used (27 files)

#### **`src/api/` - API Client**
- **Responsibility:** Axios client setup
- **Status:** ✅ Actively used (1 file - client.js)

#### **`src/styles/` - Global Styles**
- **Responsibility:** CSS stylesheets
- **Status:** ✅ Actively used (2 files)

#### **`src/theme/` - Theme Configuration**
- **Responsibility:** Additional theme configuration
- **Status:** ✅ Actively used (1 file)

---

## 2️⃣ FILE RESPONSIBILITY MAPPING

### **Authentication (Login, Logout, User State)**

| File | Responsibility | Backend Connected? |
|------|----------------|-------------------|
| `services/authService.js` | Login flow, logout, localStorage management | ✅ Yes |
| `features/authSlice.js` | Redux slice for auth state | ✅ Via authService |
| `pages/Login/` | Login UI | ✅ Yes |

**Flow:**
1. User enters credentials
2. `authService.login()` calls `api.login()` (switches between mock/real)
3. If successful, fetches employee data via `employeeService.getEmployeeProfile()`
4. Maps `roleId` (101-105) to role code (EMPLOYEE, MANAGER, TRAVEL_DESK, AVP, SVP)
5. Stores user object in localStorage
6. Redux authSlice updates

### **Dashboard Rendering**

| Dashboard | File | Data Source | Backend Connected? |
|-----------|------|-------------|-------------------|
| Employee | `DashboardEmployee.jsx` (1907 lines) | Redux `dashboardSlice` | ✅ Yes |
| Manager | `DashboardManager.jsx` (23,990 bytes) | Redux `dashboardSlice` | ✅ Yes |
| AVP/SVP/CHRO | Same as Manager with role logic | Redux `dashboardSlice` | ✅ Yes |
| Travel Desk | `TravelDeskPortal.jsx` (1885 lines) | Redux `fetchTravelDeskData` | ✅ Yes |

**Common Pattern:**
- All dashboards dispatch `fetchDashboardData()` or `fetchTravelDeskData()` on mount
- Redux thunks call `dashboardService` methods
- `dashboardService` calls `realApi` (or `mockApi` if flag set)
- Data flows: Backend → Service → Redux → Component

### **API Communication (Service Files)**

| Service | Endpoints | Mock/Real Switch? | Notes |
|---------|-----------|-------------------|-------|
| `apiService.js` | **SWITCHER** | ✅ Yes - `USE_MOCK_API ? mockApi : realApi` | **Single point of truth** |
| `authService.js` | Login, logout, profile | ✅ Via apiService | |
| `dashboardService.js` | Stats, pending approvals, recent requests | ✅ Via realApi directly | ⚠️ Bypasses apiService |
| `employeeService.js` | Employee data, travel details | ✅ Via api (switchable) | |
| `managerService.js` | Team data, insertTravel | ✅ Partial - checks `USE_MOCK_API` flag | ⚠️ Inline conditionals |
| `documentService.js` | Document upload/download | ✅ Via realApi directly | ⚠️ Bypasses apiService |
| `approvalService.js` | Approve/reject requests | ✅ Checks `USE_MOCK_API` flag | ⚠️ Inline conditionals |
| `travelRequestService.js` | Travel request CRUD | ✅ Checks `USE_MOCK_API` flag | ⚠️ Inline conditionals |
| `notificationService.js` | Notifications | ✅ Checks `USE_MOCK_API` flag | ⚠️ Inline conditionals |
| `travelDeskService.js` | Travel Desk actions | ✅ Checks `USE_MOCK_API` flag | ⚠️ Inline conditionals |

**⚠️ CRITICAL INSIGHT:**
- Some services call `realApi` directly (bypassing `apiService.js` switcher)
- Other services have inline `if (apiConfig.USE_MOCK_API)` conditionals
- **NOT CENTRALIZED** - Multiple mock-switching patterns exist

### **Status Mapping / Status Rendering**

| File | Responsibility | Maintainability |
|------|----------------|----------------|
| `utils/statusMapper.js` (775 lines) | **Master status mapping** - converts backend status codes (1-17) to UI chips, labels, colors | ✅ Centralized |
| `utils/statusMapping.js` (901 bytes) | Appears to be older/redundant status mapping | ⚠️ May be unused |
| `config/apiConfig.js` | Simple status codes (0-4) | ⚠️ Outdated, doesn't match statusMapper.js |

**Status Codes in Use (from statusMapper.js):**
```
1  - INITIAL_MANAGER_INITIATED
2  - INITIAL_AVP_DVP_INITIATED
3  - INITIAL_SVP_INITIATED
4  - INITIAL_MANAGER_APPROVED
5  - INITIAL_AVP_DVP_APPROVED
6  - INITIAL_SVP_APPROVED
7  - FINAL_MANAGER_PENDING
8  - FINAL_AVP_DVP_PENDING
9  - FINAL_SVP_PENDING
10 - FINAL_MANAGER_APPROVED
11 - FINAL_AVP_DVP_APPROVED
12 - FINAL_SVP_APPROVED
13 - TD_REQUESTED_DOCUMENTS (Travel Desk requests docs from Employee)
14 - TD_DOCUMENTS_RECEIVED (Employee submitted docs)
15 - TD_BOOKING_IN_PROGRESS (Travel Desk booking)
16 - TD_BOOKED (Tickets uploaded)
17 - COMPLETED
```

**Important:** Status is **frontend-hardcoded**, not backend-driven. The mapping lives in `statusMapper.js`.

### **Document Upload & OCR Related UI**

| Component | File | Functionality | Backend Connected? |
|-----------|------|---------------|-------------------|
| Document Upload Modal | `DashboardEmployee.jsx` (lines 915-984) | Drag-and-drop upload, file validation | ✅ Yes |
| Document Section | `DashboardEmployee.jsx` (lines 354-585) | Display uploaded/pending docs | ✅ Yes |
| Passport OCR Card | `DashboardEmployee.jsx` (lines 188-352) | Display OCR data, edit, verify | ✅ Yes |
| Visa OCR Card | `TravelDeskPortal.jsx` (lines 376-492) | Display visa OCR data | ✅ Yes |
| Document Service | `services/documentService.js` (20,899 bytes) | Upload, download, OCR backend calls | ✅ Yes |

**Document IDs (from statusMapper.js):**
```
1  - PASSPORT
2  - INVITATION_LETTER
3  - COVER_LETTER
4  - KT_PLAN
5  - HOTEL_BOOKING
6  - FLIGHT_BOOKING
7  - TRAVEL_INSURANCE
8  - VISA_FORM
9  - LETTER_OF_INTENT
10 - VISA
11 - INSURANCE_DECLARATION
12 - VISA_APPOINTMENT
```

### **Travel Desk Flow**

| Step | Status | Action | File Location |
|------|--------|--------|---------------|
| 1. Request Documents | 6 → 13 | Travel Desk requests docs from Employee | `TravelDeskPortal.jsx` line 700-715 |
| 2. Employee Uploads | 13 | Employee uploads documents | `DashboardEmployee.jsx` line 915-984 |
| 3. Submit Documents | 13 → 14 | Employee submits via button | `DashboardEmployee.jsx` dispatches `submitDocumentsThunk` |
| 4. Review Documents | 14 | Travel Desk views uploaded docs | `TravelDeskPortal.jsx` line 717-754 |
| 5. OCR Process | 14 | Travel Desk triggers OCR (auto or manual) | Not fully wired yet |
| 6. Upload Visa | 14 → 9 | Travel Desk uploads visa, sends to SVP for final approval | `TravelDeskPortal.jsx` line 885-916 |
| 7. Final Approval | 9 → 12 | SVP/AVP/Manager approves | `ApplicationStatus.jsx` |
| 8. Start Booking | 12 → 15 | Travel Desk starts booking | `TravelDeskPortal.jsx` line 970-983 |
| 9. Upload Booking Docs | 15 → 16 | Travel Desk uploads hotel/flight/insurance | `TravelDeskPortal.jsx` line 918-950 |
| 10. Complete | 16 → 17 | Employee or Travel Desk marks complete | Various |

**OCR Integration:**
- Passport OCR: ✅ Wired via `documentService.getPassportOCR()`
- Visa OCR: ✅ Wired via `realApi.getVisaInfo()`
- **Both call backend endpoints**

---

## 3️⃣ API FLOW UNDERSTANDING

### **Base URL Source**

```javascript
// config/apiConfig.js
const REAL_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7133';
```

**Source:** Environment variable `REACT_APP_API_BASE_URL` or defaults to `https://localhost:7133`

### **Mock vs Real API Decision**

**Central Flag:**
```javascript
// config/apiConfig.js line 9
const USE_MOCK_API = false; // ✅ Set to FALSE to use real API
```

**Current Setting:** `false` (Using real API)

**Switch Mechanisms (MULTIPLE PATTERNS):**

#### Pattern 1: Central Switcher (Best Practice)
```javascript
// services/apiService.js
const api = apiConfig.USE_MOCK_API ? mockApi : realApi;
export default api;
```
✅ **Used by:** `authService`, `employeeService`

#### Pattern 2: Direct realApi Import
```javascript
// services/dashboardService.js, documentService.js
import realApi from './api/realApi';
// ... directly calls realApi.method()
```
⚠️ **Problem:** Bypasses switcher, always uses real API even if flag is `true`

#### Pattern 3: Inline Conditional Checks
```javascript
// services/managerService.js, approvalService.js, etc.
if (apiConfig.USE_MOCK_API) {
  return mockApi.something();
} else {
  return realApi.something();
}
```
⚠️ **Problem:** Scattered logic, harder to maintain

### **Which Services Hit Backend Endpoints**

| Service | Backend Connected | Endpoints Used |
|---------|-------------------|----------------|
| `authService` | ✅ Yes | `/api/LoginRequest`, `/api/GetRollMaster` |
| `employeeService` | ✅ Yes | `/api/employee/GetEmployeeData`, `/api/employee/TravelDetailByEmpId` |
| `managerService` | ✅ Yes | `/api/manager/*` endpoints |
| `dashboardService` | ✅ Yes | Various employee/manager/travel endpoints |
| `documentService` | ✅ Yes | `/api/employee/AddDocument`, `/api/HelpDesk/GetEmployeeDocuments`, OCR endpoints |
| `approvalService` | ✅ Yes | `/api/UpdateTravelStatus` |
| `travelRequestService` | ✅ Yes | `/api/manager/InsertTravelDetail` |

**ALL dashboards are connected to backend when `USE_MOCK_API = false`**

### **Which Dashboards Rely on Mock/Static Data**

**Current State (USE_MOCK_API = false):**
- ❌ None - all dashboards use real backend
  
**If `USE_MOCK_API = true`:**
- ✅ All dashboards would use mock data from `mockApi.js`
- ⚠️ EXCEPT `dashboardService` and `documentService` (they bypass switcher)

---

## 4️⃣ MOCK LOGIC IDENTIFICATION

### **Mock Files and Their Purposes**

| File | Size | Purpose | Usage |
|------|------|---------|-------|
| `services/api/mockApi.js` | 10,508 bytes | **Primary mock API** - mimics backend endpoints, persists to localStorage | ✅ Used when `USE_MOCK_API = true` |
| `services/mockDataService.js` | 10,794 bytes | **Secondary mock service** - static mock data, different structure | ⚠️ Rarely/never used (not imported in main services) |

### **Is Mock Logic Centralized?**

**❌ NO - Mock logic is SCATTERED across multiple patterns:**

1. **Centralized Switcher** (`apiService.js`) - ✅ Clean
2. **Direct realApi imports** - ⚠️ Bypasses switching
3. **Inline conditionals in services** - ⚠️ Scattered

### **Mock Response Structure vs Backend Response**

**mockApi.js Structure:**
```javascript
// Example: login
return {
  status: "Success",
  result: employee.refRoleId,  // Returns roleId
  error: null
};
```

**Backend Response Structure (expected):**
```javascript
{
  "status": "Success",
  "result": { ...data },
  "error": null
}
```

**Assessment:**
- ✅ mockApi.js **matches backend structure** (consistent naming: `status`, `result`, `error`)
- ✅ Property names use correct casing (e.g., `empId`, `Name`, `Email`)
- ✅ Persists documents to localStorage for realistic testing

**mockDataService.js Structure:**
```javascript
// Different structure - wraps response
wrapResponse(data, success = true) {
  return {
    status: success ? 'success' : 'error',
    data: data
  };
}
```

**Assessment:**
- ⚠️ **DOES NOT match backend structure** (uses lowercase `status`, wraps in `data` instead of `result`)
- ⚠️ Appears to be **legacy/unused** code

### **Centralization Summary**

| Aspect | Status |
|--------|--------|
| Mock API switching | ⚠️ **Partially centralized** (3 different patterns) |
| Mock data source | ✅ Centralized in `mockApi.js` |
| Response structure | ✅ `mockApi.js` matches backend |
| Persistence | ✅ Documents persisted to localStorage |

---

## 5️⃣ REDUX & STATE ANALYSIS

### **Redux Slices Present**

| Slice | File | Lines | Purpose |
|-------|------|-------|---------|
| `dashboardSlice` | `redux/slices/dashboardSlice.js` | 424 | **ALL dashboard state** (stats, pending approvals, requests, travel desk data) |
| `authSlice` | `features/authSlice.js` | Unknown | Authentication state (user, token, login status) |

**⚠️ CRITICAL:** Only **ONE** dashboard slice handles ALL dashboard data for ALL roles

### **dashboardSlice State Structure**

```javascript
initialState: {
  stats: [],                    // Dashboard metrics
  pendingApprovals: [],         // For managers/approvers
  getAllDetails: [],            // All travel details
  allEmployees: [],             // Team members
  recentRequests: [],           // Recent travel requests
  activeRequest: null,          // Currently active request
  pendingRequests: [],          // Travel Desk: pending bookings
  completedRequests: [],        // Travel Desk: completed bookings
  viewRequestDetails: null,     // Travel Desk: request detail view
  loading: false,               // Global loading state
  detailsLoading: false,        // Details modal loading
  bookingInProgress: false,     // Booking action loading
  submittingDocuments: false,   // Document submit loading
  error: null,                  // Error state
  notifications: [],            // User notifications
  approvalHistory: []           // Approval history
}
```

### **Non-Serializable Data Issues**

**✅ NO non-serializable data found**
- Icons stored as **string keys** (e.g., `'Flight'`, `'PendingActions'`)
- Icon components mapped in UI layer, not stored in Redux
- All data is JSON-serializable

### **Duplicated or Overlapping State**

| Duplication | Issue |
|-------------|-------|
| `activeRequest` vs `recentRequests[0]` | ✅ Intentional - `activeRequest` is convenience reference |
| `pendingRequests` vs `pendingApprovals` | ✅ Different - `pendingRequests` for Travel Desk, `pendingApprovals` for approvers |
| `getAllDetails` vs `allEmployees` | ✅ Different - `getAllDetails` has travel data, `allEmployees` is just employee list |

**No problematic duplication found**

### **Risky Patterns**

#### ⚠️ **Potential `.map()` on undefined:**

```javascript
// dashboardSlice.js line 97-111
travels.map(async (item) => {
  const employeeName = await getEmployeeName(item.empId);
  // ...
})
```

**Risk:** If `travels` is `undefined` or `null`, this will crash

**Current Protection:**
```javascript
if (travels.length === 0) return { pendingRequests: [], completedRequests: [] };
```

**Assessment:** ✅ Protected (checks `length` which will fail safely if undefined)

#### ⚠️ **Array mutation potential:**

```javascript
// dashboardSlice.js line 289-290
state.notifications.unshift({
  id: Date.now(),
  message: action.payload,
  // ...
});
```

**Assessment:** ✅ Safe - Redux Toolkit uses Immer for immutability

### **State Slice Summary**

| Aspect | Status |
|--------|--------|
| Non-serializable data | ✅ None found |
| Duplicated state | ✅ No problematic duplication |
| Unsafe array operations | ✅ Protected by Redux Toolkit's Immer |
| Async thunks | ✅ Properly implemented with `createAsyncThunk` |

---

## 6️⃣ STATUS FLOW UNDERSTANDING

### **All Statuses Frontend Understands**

**From `utils/statusMapper.js` (Master Source):**

| Code | Status Key | Label | Color | Category |
|------|-----------|-------|-------|----------|
| 1 | INITIAL_MANAGER_INITIATED | Manager Initiated | info | Initial Pending |
| 2 | INITIAL_AVP_DVP_INITIATED | AVP/DVP Initiated | info | Initial Pending |
| 3 | INITIAL_SVP_INITIATED | SVP Initiated | info | Initial Pending |
| 4 | INITIAL_MANAGER_APPROVED | Manager Approved | success | Initial Approved |
| 5 | INITIAL_AVP_DVP_APPROVED | AVP/DVP Approved | success | Initial Approved |
| 6 | INITIAL_SVP_APPROVED | SVP Approved | success | Initial Approved |
| 7 | FINAL_MANAGER_PENDING | Manager Final Review | warning | Final Pending |
| 8 | FINAL_AVP_DVP_PENDING | AVP/DVP Final Review | warning | Final Pending |
| 9 | FINAL_SVP_PENDING | SVP Final Review | warning | Final Pending |
| 10 | FINAL_MANAGER_APPROVED | Manager Final Approved | success | Final Approved |
| 11 | FINAL_AVP_DVP_APPROVED | AVP/DVP Final Approved | success | Final Approved |
| 12 | FINAL_SVP_APPROVED | SVP Final Approved | success | Final Approved |
| 13 | TD_REQUESTED_DOCUMENTS | Documents Requested | warning | Document Phase |
| 14 | TD_DOCUMENTS_RECEIVED | Documents Uploaded | info | Document Phase |
| 15 | TD_BOOKING_IN_PROGRESS | Booking in Progress | info | Booking Phase |
| 16 | TD_BOOKED | Tickets Uploaded | success | Booking Phase |
| 17 | COMPLETED | Completed | success | Completed |

### **Status to UI Mapping**

| Aspect | Implementation | Location |
|--------|----------------|----------|
| **Chip Color** | Hardcoded in `statusMapper.js` | Line 151-527 |
| **Label Text** | Hardcoded in `statusMapper.js` | Same function |
| **Background Color** | Hardcoded in `statusMapper.js` | Same function |
| **Description** | Hardcoded in `statusMapper.js` | Same function |

**Example:**
```javascript
case 13:
  return {
    key: 'TD_REQUESTED_DOCUMENTS',
    label: 'Documents Requested',
    shortLabel: 'Docs Requested',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    description: 'Travel Desk has requested documents from employee'
  };
```

### **Where Status Mapping Lives**

**✅ Centralized in ONE file:**
- `utils/statusMapper.js` (775 lines)

**Functions Provided:**
- `statusToChip(code)` - Main mapping function
- `getStatusLabel(code)` - Get label only
- `getStatusColor(code)` - Get color only
- `getStatusBgColor(code)` - Get background color only
- `getStatusDescription(code)` - Get description only
- `requiresEmployeeAction(code)` - Check if employee action needed
- `requiresHelpdeskAction(code)` - Check if helpdesk action needed
- `canUploadDocuments(code)` - Check if status allows upload (status 13)
- `isInBookingPhase(code)` - Check if booking phase
- `isCompleted(code)` - Check if completed

### **Backend-driven or Frontend-hardcoded?**

**❌ Frontend-hardcoded**

**Evidence:**
1. All status mappings defined statically in `statusMapper.js`
2. No API endpoint to fetch status definitions
3. Backend returns numeric code (1-17), frontend maps it

**Implication for MSW:**
- Status mapping logic doesn't need mocking
- Only status **codes** come from backend
- UI rendering remains frontend responsibility

---

## 7️⃣ TRAVEL DESK FLOW (CURRENT IMPLEMENTATION)

### **Travel Desk Actions**

| Action | Trigger | Status Change | Implementation | Backend Call |
|--------|---------|---------------|----------------|--------------|
| **Request Documents** | Button click on status 6 | 6 → 13 | `TravelDeskPortal.jsx` line 700-715 | ✅ `realApi.updateTravelStatus()` |
| **View Documents** | Button click on status 14 | None | `TravelDeskPortal.jsx` line 717-754 | ✅ `documentService.getEmployeeAllDocuments()` |
| **Upload Visa** | Upload + Submit on status 14 | 14 → 9 | `TravelDeskPortal.jsx` line 885-916 | ✅ `documentService.uploadDocument()` + `updateTravelStatus()` |
| **Start Booking** | Button click on status 12 | 12 → 15 | `TravelDeskPortal.jsx` line 970-983 | ✅ `realApi.updateTravelStatus()` |
| **Upload Booking Docs** | Upload hotel/flight/insurance | None | `TravelDeskPortal.jsx` line 756-812 | ✅ `documentService.uploadDocument()` |
| **Submit Booking** | Submit button on status 15 | 15 → 16 | `TravelDeskPortal.jsx` line 918-950 | ✅ `processBooking()` thunk |

### **Statuses Travel Desk Handles**

| Status Group | Statuses | View |
|--------------|----------|------|
| **Pending Bookings** | 13, 14, 15 | Main table (upper section) |
| **Completed Bookings** | 16, 17 | Separate table (lower section) |

**Filtering Logic:**
```javascript
// dashboardSlice.js line 115-116
pendingRequests: allRequests.filter(req => req.statusId < 16),
completedRequests: allRequests.filter(req => req.statusId >= 16)
```

### **OCR / Document Verification**

| Document Type | OCR Endpoint | Verification Status | UI Location |
|---------------|--------------|---------------------|-------------|
| **Passport** | `/api/employee/GetPassportOCR` | ✅ Wired | `DashboardEmployee.jsx` (PassportOCRCard) |
| **Visa** | `/api/travelDesk/GetVisaOCR` | ✅ Wired | `TravelDeskPortal.jsx` (VisaOCRCard) |

**Flow:**
1. Employee uploads document (e.g., Passport)
2. Backend automatically runs OCR and extracts data
3. Travel Desk fetches OCR data via `getPassportOCR()` or `getVisaInfo()`
4. UI displays editable OCR data card
5. Travel Desk can edit/verify OCR data
6. Verified data saved back to backend

**Assessment:** ✅ OCR is **fully wired**, not placeholder

### **Document Upload Mechanism**

**Travel Desk uploads documents for:**
- Visa (Document ID: 10)
- Hotel Booking (Document ID: 5)
- Flight Booking (Document ID: 6)
- Travel Insurance (Document ID: 7)

**Implementation:**
```javascript
// TravelDeskPortal.jsx line 756-812
const handleDocumentUpload = async (doc, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('empId', currentRequest.employeeId);
  formData.append('documentId', doc.id);
  
  await documentService.uploadDocument(formData);
  // Refresh documents
};
```

**Backend Endpoint:** `/api/employee/AddDocument` (via `documentService`)

---

## 8️⃣ UNUSED / REDUNDANT CODE

### **Files Likely Safe to Remove**

| File | Reason | Recommendation |
|------|--------|----------------|
| `services/mockDataService.js` | Not imported anywhere, different response structure than backend | ⚠️ **Needs review** - may be legacy |
| `utils/statusMapping.js` (901 bytes) | Smaller/older status mapping, `statusMapper.js` is the master | ⚠️ **Needs review** - check imports |
| `config/temp.js` | Named "temp", likely experimental | ✅ **Safe to remove after review** |

### **Redundant Status Definitions**

| Location | Status Codes | Usage |
|----------|--------------|-------|
| `config/apiConfig.js` | 0-4 (PENDING, SUBMITTED, MANAGER_APPROVED, COMPLETED, REJECTED) | ⚠️ **Outdated** - doesn't match current workflow |
| `utils/constants.js` | String-based statuses (DRAFT, SUBMITTED, etc.) | ⚠️ **Not used** - numeric codes used instead |
| `utils/statusMapper.js` | 1-17 (Comprehensive) | ✅ **Active** - master source |

**Recommendation:** Remove outdated status definitions from `apiConfig.js` and `constants.js`

### **Duplicate Mock Logic**

| File | Usage | Structure |
|------|-------|-----------|
| `mockApi.js` | ✅ Used via `apiService.js` | Matches backend |
| `mockDataService.js` | ❌ Not imported | Different structure |

**Recommendation:** Remove `mockDataService.js` after confirming no imports

### **Code Duplication**

**✅ NO major code duplication found**

**Minor duplication (acceptable):**
- Status label formatting repeated in dashboard components (intentional for customization)
- File upload logic similar in Employee and Travel Desk (intentional for different contexts)

---

## 9️⃣ RISK ASSESSMENT FOR MSW INTEGRATION

### **SAFE Components (Low Risk)**

| Component | Reason |
|-----------|--------|
| **Redux slices** | No direct API calls, only dispatch thunks |
| **UI Components** | Only render data from props/Redux |
| **Status Mapper** | Pure functions, no API dependency |
| **Utilities** | Helper functions, no API calls |
| **Theme/Styles** | Static configuration |

### **RISKY Components (High Risk - Tightly Coupled to Mock Logic)**

| Component | Risk Level | Issue | MSW Impact |
|-----------|-----------|-------|------------|
| `services/dashboardService.js` | 🔴 **HIGH** | Directly imports `realApi`, bypasses switcher | MSW won't intercept unless we refactor to use central switcher |
| `services/documentService.js` | 🔴 **HIGH** | Directly imports `realApi`, bypasses switcher | Same issue |
| `services/managerService.js` | 🟡 **MEDIUM** | Inline `if (USE_MOCK_API)` checks | MSW can work, but need to remove inline conditionals |
| `services/approvalService.js` | 🟡 **MEDIUM** | Inline `if (USE_MOCK_API)` checks | Same |
| `services/travelRequestService.js` | 🟡 **MEDIUM** | Inline `if (USE_MOCK_API)` checks | Same |
| `services/travelDeskService.js` | 🟡 **MEDIUM** | Inline `if (USE_MOCK_API)` checks | Same |
| `services/notificationService.js` | 🟡 **MEDIUM** | Inline `if (USE_MOCK_API)` checks | Same |

### **MSW Integration Risks**

**If we introduce MSW without refactoring:**

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Bypassed Switcher Services** | MSW won't intercept `dashboardService` and `documentService` calls | ❌ Must refactor to use HTTP client that MSW can intercept |
| **Inline Mock Conditionals** | Services check flag instead of relying on MSW | ⚠️ Remove conditionals, let MSW handle mocking |
| **Multiple API Clients** | Some services use `api`, others use `realApi` directly | ❌ Must standardize on ONE HTTP client (e.g., `api/client.js`) |
| **localStorage Persistence** | `mockApi.js` persists to localStorage | ✅ MSW can replicate this in handlers |

### **Refactoring Required for Safe MSW Integration**

**Priority 1 (Critical):**
1. ✅ Refactor `dashboardService.js` to use `api/client.js` instead of `realApi`
2. ✅ Refactor `documentService.js` to use `api/client.js` instead of `realApi`
3. ✅ Remove all inline `if (USE_MOCK_API)` conditionals from services
4. ✅ Standardize ALL services to use single HTTP client (`api/client.js`)

**Priority 2 (Important):**
5. ✅ Remove `mockApi.js` and `mockDataService.js` (replace with MSW handlers)
6. ✅ Remove `USE_MOCK_API` flag from `apiConfig.js`
7. ✅ Update `apiService.js` to only export `realApi` (or single client)

**Priority 3 (Cleanup):**
8. ✅ Remove unused status definitions from `apiConfig.js` and `constants.js`
9. ✅ Remove `mockDataService.js` and `statusMapping.js` if confirmed unused
10. ✅ Remove `temp.js`

---

## 🔟 SUMMARY & KEY FINDINGS

### **Current Architecture**

```
Frontend
├── Pages (Dashboards)
│   └── Dispatch Redux Thunks
├── Redux Slices
│   └── Call Service Layer
├── Services (Business Logic)
│   ├── Option A: Use apiService.js (switcher) ✅
│   ├── Option B: Use realApi directly ⚠️
│   └── Option C: Inline if (USE_MOCK_API) ⚠️
└── API Layer
    ├── api/client.js (Axios instance)
    ├── api/mockApi.js (Mock implementation)
    └── api/realApi.js (Real HTTP calls)
```

### **Critical Insights**

1. **Mock switching is NOT centralized** - 3 different patterns exist
2. **Some services bypass the switcher** - direct `realApi` imports
3. **Status mapping is frontend-hardcoded** - not backend-driven
4. **OCR is fully wired** - not placeholder code
5. **All dashboards connect to backend** when `USE_MOCK_API = false`
6. **Only ONE Redux slice** handles all dashboard data
7. **No non-serializable state** in Redux
8. **Response structures match** between `mockApi.js` and backend

### **MSW Integration Readiness**

| Aspect | Status | Action Required |
|--------|--------|-----------------|
| HTTP Client | ⚠️ **Multiple clients** | Standardize to ONE client |
| Service Layer | ⚠️ **Mixed patterns** | Refactor to consistent pattern |
| Mock Logic | ⚠️ **Scattered** | Centralize in MSW handlers |
| Redux | ✅ **Safe** | No changes needed |
| UI Components | ✅ **Safe** | No changes needed |
| Status Mapping | ✅ **Safe** | No changes needed |

### **Recommended Refactoring Approach**

**Phase 1: Standardize HTTP Client**
- Make ALL services use `api/client.js` (Axios instance)
- Remove direct `realApi` imports

**Phase 2: Remove Mock Logic from Services**
- Delete all `if (USE_MOCK_API)` conditionals
- Services should ONLY make HTTP calls

**Phase 3: Introduce MSW**
- Create MSW handlers matching `mockApi.js` logic
- Set up MSW in development mode
- Test all dashboards and flows

**Phase 4: Cleanup**
- Remove `mockApi.js`, `mockDataService.js`
- Remove `USE_MOCK_API` flag
- Clean up unused files

---

## 📋 FILES REQUIRING ATTENTION FOR MSW

### **High Priority (Must Refactor)**

1. `src/services/dashboardService.js` - Direct `realApi` import
2. `src/services/documentService.js` - Direct `realApi` import
3. `src/services/managerService.js` - Inline conditionals
4. `src/services/approvalService.js` - Inline conditionals
5. `src/services/travelRequestService.js` - Inline conditionals
6. `src/services/notificationService.js` - Inline conditionals
7. `src/services/travelDeskService.js` - Inline conditionals

### **Medium Priority (Nice to Have)**

8. `src/config/apiConfig.js` - Remove outdated status codes
9. `src/utils/constants.js` - Remove unused status definitions
10. `src/services/mockDataService.js` - Confirm unused and delete

### **Low Priority (Cleanup)**

11. `src/config/temp.js` - Delete if experimental
12. `src/utils/statusMapping.js` - Confirm unused and delete

---

**End of Analysis**

This codebase is **well-structured** but has **scattered mock logic** that will complicate MSW integration. The primary issue is **lack of centralized HTTP client usage**. Once standardized, MSW integration will be straightforward.
