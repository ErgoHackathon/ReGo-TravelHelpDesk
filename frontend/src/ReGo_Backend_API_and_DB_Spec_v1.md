✅ 1. Project Summary (Backend Responsibility)

The backend must support a multi-role corporate travel workflow.

User Roles

EMPLOYEE – Raises travel request, uploads documents

MANAGER – Reviews & approves/rejects

AVP → SVP → CHRO – Escalation chain approvals

FINANCE – Budget confirmation

TRAVEL_DESK – Books flight/hotel, uploads tickets

ADMIN – Overall view

Backend Responsibilities

Provide secure login (email + password only, NO JWT for now).

Provide all travel request–related CRUD APIs.

Handle role-wise approval flow.

Store uploaded documents.

Serve dashboards based on role.

Serve notifications.

Track request movement through levels.

✅ 2. DATABASE STRUCTURE (SQL TABLES + SCHEMA)

This entire DB structure matches your UI flows & missing APIs.

2.1 — Users Table

Holds login + role details.

CREATE TABLE Users (
    UserId INT IDENTITY PRIMARY KEY,
    FullName VARCHAR(150) NOT NULL,
    Email VARCHAR(120) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Department VARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);


📌 Dummy Records Example

INSERT INTO Users (FullName, Email, PasswordHash, Role)
VALUES
('Employee Test', 'employee@rego.com', 'Test123!', 'EMPLOYEE'),
('Manager Test', 'manager@rego.com', 'Test123!', 'MANAGER'),
('AVP Test', 'avp@rego.com', 'Test123!', 'AVP'),
('SVP Test', 'svp@rego.com', 'Test123!', 'SVP'),
('CHRO Test', 'chro@rego.com', 'Test123!', 'CHRO'),
('Finance Test', 'finance@rego.com', 'Test123!', 'FINANCE'),
('Travel Desk Test', 'traveldesk@rego.com', 'Test123!', 'TRAVEL_DESK');

2.2 — TravelRequests Table

Stores high-level travel request details.

CREATE TABLE TravelRequests (
    RequestId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId),
    FromLocation VARCHAR(100),
    ToLocation VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    Purpose VARCHAR(300),
    Status VARCHAR(50) DEFAULT 'PENDING_MANAGER',
    CreatedAt DATETIME DEFAULT GETDATE()
);

2.3 — ApprovalHistory Table
CREATE TABLE ApprovalHistory (
    HistoryId INT IDENTITY PRIMARY KEY,
    RequestId INT FOREIGN KEY REFERENCES TravelRequests(RequestId),
    ApprovedBy INT FOREIGN KEY REFERENCES Users(UserId),
    Role VARCHAR(100),
    Action VARCHAR(50), -- APPROVED / REJECTED / RETURNED
    Comments VARCHAR(500),
    Timestamp DATETIME DEFAULT GETDATE()
);

2.4 — Documents Table
CREATE TABLE Documents (
    DocumentId INT IDENTITY PRIMARY KEY,
    RequestId INT FOREIGN KEY REFERENCES TravelRequests(RequestId),
    FileName VARCHAR(255),
    FileUrl VARCHAR(500),
    UploadedAt DATETIME DEFAULT GETDATE()
);

2.5 — Bookings Table (Travel Desk)
CREATE TABLE Bookings (
    BookingId INT IDENTITY PRIMARY KEY,
    RequestId INT FOREIGN KEY REFERENCES TravelRequests(RequestId),
    FlightNumber VARCHAR(50),
    HotelName VARCHAR(100),
    BookingStatus VARCHAR(50), -- BOOKED / CANCELLED
    TicketUrl VARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);

2.6 — Notifications Table
CREATE TABLE Notifications (
    NotificationId INT IDENTITY PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    Message VARCHAR(250),
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

✅ 3. BACKEND API SPECIFICATION

All APIs follow:

BASE URL:

/api/

🔐 3.1 Authentication APIs
POST /auth/login

Login using email + password
(No JWT required for now)

Request

{
  "email": "employee@rego.com",
  "password": "Test123!"
}


Response

{
  "userId": 1,
  "fullName": "Employee Test",
  "role": "EMPLOYEE",
  "email": "employee@rego.com"
}

🟦 3.2 Travel Request APIs
POST /travel/request/create

Employee raises new request.

Request

{
  "userId": 1,
  "fromLocation": "Mumbai",
  "toLocation": "Bangalore",
  "startDate": "2025-12-12",
  "endDate": "2025-12-15",
  "purpose": "Client meeting"
}


Response

{
  "requestId": 104,
  "status": "PENDING_MANAGER"
}

GET /travel/request/by-user/{userId}

Employee sees their own requests.

GET /travel/request/{requestId}

Fetch complete request + approvals + documents + booking details.

Response Example

{
  "requestId": 104,
  "status": "PENDING_MANAGER",
  "details": {...},
  "approvals": [...],
  "documents": [...],
  "booking": {...}
}

🟩 3.3 Approval APIs

For Manager → AVP → SVP → CHRO

POST /approval/submit

Used by ALL approving roles.

Request

{
  "requestId": 104,
  "approvedBy": 3,
  "role": "MANAGER",
  "action": "APPROVED",
  "comments": "Looks good"
}


Response

{
  "status": "APPROVED_MANAGER"
}

Role → NextStatus Mapping
ROLE	ACTION	NEXT STATUS
MANAGER	APPROVED	PENDING_AVP
AVP	APPROVED	PENDING_SVP
SVP	APPROVED	PENDING_CHRO
CHRO	APPROVED	PENDING_FINANCE
FINANCE	APPROVED	PENDING_TRAVEL_DESK
TRAVEL_DESK	BOOKED	COMPLETED
📂 3.4 Document Upload APIs
POST /documents/upload

Multipart form-data upload

Fields:

requestId
file


Response:

{
  "documentId": 55,
  "fileUrl": "https://rego-docs/104/ticket.pdf"
}

GET /documents/by-request/{requestId}
💼 3.5 Travel Desk APIs
POST /travel/book

Travel desk updates booking.

Request

{
  "requestId": 104,
  "flightNumber": "AI203",
  "hotelName": "Taj",
  "ticketUrl": "some url"
}


Response:

{
  "status": "BOOKED"
}

🔔 3.6 Notification APIs
GET /notifications/{userId}
PUT /notifications/mark-read/{notificationId}
📊 3.7 Dashboard APIs (All Roles)
GET /dashboard/stats/{userId}

Auto-filtered based on role.

Example:

{
  "allRequests": 15,
  "pending": 5,
  "approved": 7,
  "rejected": 2
}

GET /dashboard/recent/{userId}

Full table list for each role.

🔧 4. BACKEND MISSING APIs (Backend must build these)

The following APIs do not exist in backend but are required by your frontend:

API Needed	Purpose
/dashboard/recent	To show tables for ALL dashboards
/travel/request/create	Matching frontend structure
/approval/submit	To support approval chain
/documents/upload	Employee + Travel Desk
/travel/book	For Travel Desk workflow
/notifications/*	For notification icon
/travel/request/{id}	Unified Request Details Page
/travel/request/by-user/{id}	Employee listing
🧩 5. FRONTEND CHANGES Required for Integration

These are exact changes your frontend team must do:

(A) Update apiConfig.js to real APIs

Replace:

USE_MOCK_API: true


With:

USE_MOCK_API: process.env.REACT_APP_USE_MOCK === "true"


Add all required endpoints exactly as above.

(B) Update Service Layer

Update:

travelRequestService

approvalService

documentService

bookingService

dashboardService

Each must call new backend APIs mapped exactly to this document.

(C) Redux Adjustments

Dashboard slices expect mock data → change state shape to match backend response.

Notification slice required → create new one.

(D) UI Adjustments

Ensure "Request Details Page" matches backend merged response.

Ensure Role-Wise buttons call /approval/submit.

🧨 6. Common Integration Problems (Warning)

These are the MOST common problems your app will face:

❌ Problem 1 — Frontend field names ≠ Backend field names

Example:
Frontend uses fromLocation, backend may use Origin.

➡️ Ensure naming matches EXACTLY as this spec.

❌ Problem 2 — Backend returns nested objects, but frontend expects flat

Fix JSON parsing on frontend slice.

❌ Problem 3 — Document upload mismatch

Ensure:

Content-Type: multipart/form-data

❌ Problem 4 — Status flow mismatch

If backend uses MANAGER_APPROVED and frontend expects APPROVED_MANAGER → fix reducers.

❌ Problem 5 — Frontend app needs combined API (/request/{id})

Backend team must return one single object:

request

approvals

documents

booking

Instead of multiple API calls.

🎯 7. Action Plan (FASTEST SOLUTION)
Step 1 — Backend team builds missing APIs using this file.
Step 2 — You modify your frontend service layer.
Step 3 — You adjust reducers & UI to backend data shape.
Step 4 — Tomorrow in office, run end-to-end test.
Step 5 — Fix minor mismatches live with backend team.
