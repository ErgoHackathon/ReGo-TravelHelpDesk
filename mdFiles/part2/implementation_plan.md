# Implementation Plan - STEP 3: MSW Integration & Cleanup

This plan details the steps to introduce Mock Service Worker (MSW) and clean up the service layer, moving away from the ad-hoc `mockApi.js` implementation to a standardized network interception model.

## User Review Required

> [!IMPORTANT]
> **MSW Activation Logic**: The application will now *always* make real network requests (via Axios). If `USE_MOCK_API` is true, MSW will intercept these requests in the browser. This mimics the production environment much more closely than the previous "if/else" service swapping.

## Proposed Changes

### 1. MSW Installation & Setup

#### [NEW] `src/mocks/browser.js`
- Standard MSW worker setup code.

#### [NEW] `src/mocks/index.js`
- Entry point to conditionally start the worker.

#### [NEW] `src/mocks/handlers/`
- Directory for all API handlers.
- **`auth.handlers.js`**: `POST /api/LoginRequest`.
- **`employee.handlers.js`**: `POST /api/employee/GetEmployeeData`, `POST /api/employee/TravelDetailByEmpId`, etc.
- **`manager.handlers.js`**: `POST /api/manager/*` endpoints.
- **`travel.handlers.js`**: `POST /api/UpdateTravelStatus`, `GET /api/GetStatusMaster`, etc.
- **`document.handlers.js`**: Handle document uploads/retrievals via employee endpoints.
- **`common.handlers.js`**: `GET /api/GetAllDocumentsList`, etc.

> [!NOTE]
> The logic currently inside `src/services/api/mockApi.js` (including `mockDB` and `localStorage` persistence) will be ported into a utility `src/mocks/db.js` so handlers can share the stateful mock database.

### 2. Service Layer Refactoring

#### [MODIFY] `src/services/apiService.js`
- Remove the conditional import of `mockApi` and `realApi`.
- **Action**: Always export `realApi` (or rename `realApi` logic directly into `apiService`).
- **Result**: The app always tries to hit `http://localhost...` (or configured API URL).

#### [MODIFY] `src/index.jsx`
- Import `src/mocks/index.js`.
- Wrap the `root.render` in a logic block that waits for MSW to start if `USE_MOCK_API` is true.

### 3. Cleanup

#### [DELETE] `src/services/api/mockApi.js`
- No longer needed once MSW handles the logic.

#### [DELETE] `src/services/mockDataService.js`
- Data moved to `src/mocks/data/` or `src/mocks/db.js`.

#### [MODIFY] `src/services/*.js` (managerService, dashboardService, etc.)
- Remove any residual "mock mode" checks if they exist.
- Ensure all error handling relies on the unified `client.js` interceptors.

## Verification Plan

### Automated Verification
- **Test Command**: `npm start`
- **Verification**:
    1.  Set `USE_MOCK_API = true` in `apiConfig.js`.
    2.  Open Browser DevTools -> Console.
    3.  Verify message `[MSW] Mocking enabled` appears.
    4.  Perform Login.
    5.  Check Network Tab: Requests should appear (e.g., `LoginRequest`) and return `200 OK` (intercepted by MSW).
    6.  Perform actions (Create Request, Approve). Reload page. Data should persist (handled by `localStorage` in MSW DB).

### Manual Verification Steps
1.  **Mock Mode**:
    -   Login as Employee -> Create Request -> Verify in List.
    -   Login as Manager -> Approve Request -> Verify Status Update.
    -   Check Console Logs for `[MSW]` prefixes.
2.  **Real Mode** (Simulated):
    -   Set `USE_MOCK_API = false`.
    -   App should attempt to connect to real backend (will fail if backend is offline, but request should go out).

### Safety Checks
- Ensure `StatusMapper` logic is NOT touched.
- Ensure Redux state structure remains identical.
