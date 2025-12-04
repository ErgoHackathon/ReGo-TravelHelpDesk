# Frontend-Backend Integration Report (Spec v1)

## Overview

This document summarizes the integration of the ReGo Travel Management System frontend with the .NET backend APIs according to **ReGo_Backend_API_and_DB_Spec_v1.md**. The integration maintains full backward compatibility with mock mode for local development while enabling seamless connection to the real backend at the office.

## Files Created

### Service Files

1. **`travelRequestService.js`**
   - Location: `frontend/src/services/travelRequestService.js`
   - Methods:
     - `createTravelRequest(requestData)` → POST `/travel/request/create`
     - `getTravelRequestsByUser(userId)` → GET `/travel/request/by-user/{userId}`
     - `getTravelRequestById(requestId)` → GET `/travel/request/{requestId}`

2. **`approvalService.js`**
   - Location: `frontend/src/services/approvalService.js`
   - Methods:
     - `submitApproval(approvalData)` → POST `/approval/submit`
   - Used by: MANAGER, AVP, SVP, CHRO, FINANCE roles

3. **`documentService.js`**
   - Location: `frontend/src/services/documentService.js`
   - Methods:
     - `uploadDocuments(requestId, files)` → POST `/documents/upload`
     - `getDocumentsByRequest(requestId)` → GET `/documents/by-request/{requestId}`

4. **`travelDeskService.js`**
   - Location: `frontend/src/services/travelDeskService.js`
   - Methods:
     - `createBooking(bookingData)` → POST `/travel/book`

5. **`notificationService.js`**
   - Location: `frontend/src/services/notificationService.js`
   - Methods:
     - `getNotifications(userId)` → GET `/notifications/{userId}`
     - `markNotificationAsRead(notificationId)` → PUT `/notifications/mark-read/{notificationId}`

### Configuration Files

6. **`.env.office`**
   - Location: `frontend/.env.office`
   - Purpose: Office environment configuration
   - Contents:
     ```env
     REACT_APP_ENABLE_MOCK_API=false
     REACT_APP_API_BASE_URL=https://localhost:7133/api
     REACT_APP_ENV=production
     ```

7. **`statusMapper.js`**
   - Location: `frontend/src/utils/statusMapper.js`
   - Purpose: Convert numeric status codes to UI-friendly labels
   - Note: May need adjustment based on actual backend status strings

## Files Modified

### 1. `apiConfig.js`
- **Location**: `frontend/src/config/apiConfig.js`
- **Changes**: Replaced all API endpoints to match spec exactly
- **New Endpoints**:
  ```javascript
  export const API_ENDPOINTS = {
    // Authentication
    AUTH_LOGIN: '/auth/login',
    
    // Travel Requests
    TRAVEL_REQUEST_CREATE: '/travel/request/create',
    TRAVEL_REQUEST_BY_USER: '/travel/request/by-user',
    TRAVEL_REQUEST_BY_ID: '/travel/request',
    
    // Approvals
    APPROVAL_SUBMIT: '/approval/submit',
    
    // Documents
    DOCUMENTS_UPLOAD: '/documents/upload',
    DOCUMENTS_BY_REQUEST: '/documents/by-request',
    
    // Travel Desk
    TRAVEL_BOOK: '/travel/book',
    
    // Dashboard
    DASHBOARD_STATS: '/dashboard/stats',
    DASHBOARD_RECENT: '/dashboard/recent',
    
    // Notifications
    NOTIFICATIONS_GET: '/notifications',
    NOTIFICATIONS_MARK_READ: '/notifications/mark-read'
  };
  ```

### 2. `authService.js`
- **Location**: `frontend/src/services/authService.js`
- **Changes**: Updated login method to match spec
- **Backend Call**:
  ```javascript
  POST /auth/login
  Body: { email, password }
  Response: { userId, fullName, role, email }
  ```
- **Note**: Removed dependency on `employeeService.getEmployeeProfile()` as spec returns all data in login response

### 3. `dashboardService.js`
- **Location**: `frontend/src/services/dashboardService.js`
- **Changes**: Added spec-compliant methods
- **New Methods**:
  - `getDashboardStats(userId)` → GET `/dashboard/stats/{userId}`
  - `getDashboardRecent(userId)` → GET `/dashboard/recent/{userId}`

## Backend Endpoints Used

| Endpoint | Method | Purpose | Request Body/Params | Response |
|----------|--------|---------|---------------------|----------|
| `/auth/login` | POST | User authentication | `{ email, password }` | `{ userId, fullName, role, email }` |
| `/travel/request/create` | POST | Create travel request | `{ userId, fromLocation, toLocation, startDate, endDate, purpose }` | `{ requestId, status }` |
| `/travel/request/by-user/{userId}` | GET | Get user's requests | Path: `userId` | Array of requests |
| `/travel/request/{requestId}` | GET | Get request details | Path: `requestId` | `{ requestId, status, details, approvals, documents, booking }` |
| `/approval/submit` | POST | Submit approval/rejection | `{ requestId, approvedBy, role, action, comments }` | `{ status }` |
| `/documents/upload` | POST | Upload documents | FormData: `requestId`, `file` | `{ documentId, fileUrl }` |
| `/documents/by-request/{requestId}` | GET | Get request documents | Path: `requestId` | Array of documents |
| `/travel/book` | POST | Create booking | `{ requestId, flightNumber, hotelName, ticketUrl }` | `{ status }` |
| `/dashboard/stats/{userId}` | GET | Get dashboard stats | Path: `userId` | `{ allRequests, pending, approved, rejected }` |
| `/dashboard/recent/{userId}` | GET | Get recent requests | Path: `userId` | Array of requests |
| `/notifications/{userId}` | GET | Get notifications | Path: `userId` | Array of notifications |
| `/notifications/mark-read/{notificationId}` | PUT | Mark as read | Path: `notificationId` | Success response |

## How to Switch Between Mock and Real APIs

### For Local Development (Mock Mode)

1. Create or update `.env` file:
   ```env
   REACT_APP_ENABLE_MOCK_API=true
   REACT_APP_API_BASE_URL=https://localhost:7133/api
   REACT_APP_ENV=development
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. All API calls will use mock data
4. Console will show: `🔵 Using MOCK API for...`

### For Office Environment (Real Backend)

1. Copy `.env.office` to `.env`:
   ```bash
   copy .env.office .env
   ```
   Or manually update `.env`:
   ```env
   REACT_APP_ENABLE_MOCK_API=false
   REACT_APP_API_BASE_URL=https://localhost:7133/api
   REACT_APP_ENV=production
   ```

2. Ensure .NET backend is running on `https://localhost:7133`

3. Restart the development server:
   ```bash
   npm start
   ```

4. All API calls will hit the real backend
5. Console will show: `🟢 Using REAL API for...`

## Integration Points by Feature

### 1. Authentication
- **Component**: Login page
- **Service**: `authService.login()`
- **Backend**: POST `/auth/login`
- **Flow**:
  1. User enters email/password
  2. POST to `/auth/login`
  3. Backend returns `{ userId, fullName, role, email }`
  4. Store user object in localStorage
  5. Redirect to dashboard

### 2. Travel Request Creation
- **Component**: Raise Travel Request modal (Employee)
- **Service**: `travelRequestService.createTravelRequest()`
- **Backend**: POST `/travel/request/create`
- **Payload**: `{ userId, fromLocation, toLocation, startDate, endDate, purpose }`

### 3. View Travel Requests
- **Component**: Employee dashboard, Application Status page
- **Service**: `travelRequestService.getTravelRequestsByUser(userId)`
- **Backend**: GET `/travel/request/by-user/{userId}`

### 4. View Request Details
- **Component**: Application Status page
- **Service**: `travelRequestService.getTravelRequestById(requestId)`
- **Backend**: GET `/travel/request/{requestId}`
- **Returns**: Complete request with approvals, documents, and booking

### 5. Approvals (Manager/AVP/SVP/CHRO/Finance)
- **Component**: All manager-level dashboards
- **Service**: `approvalService.submitApproval()`
- **Backend**: POST `/approval/submit`
- **Payload**: `{ requestId, approvedBy, role, action, comments }`
- **Actions**: `APPROVED`, `REJECTED`, `RETURNED`

### 6. Document Upload
- **Component**: Employee dashboard upload modal
- **Service**: `documentService.uploadDocuments()`
- **Backend**: POST `/documents/upload`
- **Format**: `multipart/form-data` with `requestId` and `file`

### 7. Travel Desk Booking
- **Component**: Travel Desk Portal
- **Service**: `travelDeskService.createBooking()`
- **Backend**: POST `/travel/book`
- **Payload**: `{ requestId, flightNumber, hotelName, ticketUrl }`

### 8. Dashboard Data
- **Component**: All dashboards
- **Services**:
  - `dashboardService.getDashboardStats(userId)`
  - `dashboardService.getDashboardRecent(userId)`
- **Backend**:
  - GET `/dashboard/stats/{userId}`
  - GET `/dashboard/recent/{userId}`

### 9. Notifications
- **Component**: Notification bell icon
- **Services**:
  - `notificationService.getNotifications(userId)`
  - `notificationService.markNotificationAsRead(notificationId)`
- **Backend**:
  - GET `/notifications/{userId}`
  - PUT `/notifications/mark-read/{notificationId}`

## Status Flow Mapping

According to spec, the approval flow follows:

| Role | Action | Next Status |
|------|--------|-------------|
| MANAGER | APPROVED | PENDING_AVP |
| AVP | APPROVED | PENDING_SVP |
| SVP | APPROVED | PENDING_CHRO |
| CHRO | APPROVED | PENDING_FINANCE |
| FINANCE | APPROVED | PENDING_TRAVEL_DESK |
| TRAVEL_DESK | BOOKED | COMPLETED |
| Any Role | REJECTED | REJECTED |
| Any Role | RETURNED | RETURNED |

## Assumptions Made

1. **Base URL**: Configured as `https://localhost:7133/api` in `.env.office`
2. **No JWT**: Using email/password only as per spec
3. **Response Format**: Backend returns data directly, not wrapped in `{ success, data, message }`
4. **Field Names**: Using exact field names from spec (userId, requestId, fromLocation, toLocation, etc.)
5. **Status Strings**: Backend uses string statuses like "PENDING_MANAGER", "PENDING_AVP", etc.

## Differences from Previous Implementation

### What Changed:
1. **Endpoints**: Changed from `/api/Employee/*`, `/api/Manager/*` to `/travel/request/*`, `/approval/submit`, etc.
2. **Login Flow**: Simplified to single POST `/auth/login` instead of multi-step process
3. **Approval API**: Unified `/approval/submit` for all roles instead of separate endpoints
4. **Field Names**: Changed to match spec (userId instead of empId in some places)
5. **Response Structure**: Expecting direct data instead of wrapped responses

### What Stayed the Same:
1. **Mock Mode**: Fully preserved for local development
2. **Service Layer**: Clean separation maintained
3. **UI Components**: No changes to existing UI
4. **Redux**: State structure remains compatible

## Next Steps for Office Testing

1. **Start Backend**: Ensure .NET API is running on `https://localhost:7133`
2. **Switch Environment**: Copy `.env.office` to `.env`
3. **Restart Frontend**: `npm start`
4. **Test Login**: Use test accounts from spec
   - employee@rego.com / Test123!
   - manager@rego.com / Test123!
   - etc.
5. **Test Flows**:
   - Employee: Create request, upload documents
   - Manager: View team requests, approve/reject
   - Travel Desk: Create bookings
6. **Monitor Console**: Check for 🟢 indicators and API responses
7. **Check Network Tab**: Verify API calls match spec

## Known Limitations

1. **Dashboard Stats**: Using mock data until backend implements `/dashboard/stats` and `/dashboard/recent`
2. **Status Mapper**: May need adjustment if backend uses different status strings
3. **Error Handling**: May need refinement based on actual backend error responses
4. **File Upload**: Assumes backend accepts `multipart/form-data` with `requestId` and `file` fields

## Support

For any issues:
- Check console logs for 🔵/🟢 indicators
- Verify `.env` file settings
- Ensure backend is running on correct port
- Check Network tab in DevTools for API calls
- Review `ReGo_Backend_API_and_DB_Spec_v1.md` for endpoint specifications

---

**Generated**: 2025-12-03  
**Spec Version**: ReGo_Backend_API_and_DB_Spec_v1.md  
**Status**: ✅ Complete and Ready for Office Testing
