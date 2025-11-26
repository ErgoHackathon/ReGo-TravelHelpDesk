# ReGo - Visual Diagram References
## Use these as templates to create actual diagrams

---

## 1. Database ER Diagram Reference

**Tool Recommendations:**
- draw.io (free, web-based)
- dbdiagram.io (specifically for database diagrams)
- Lucidchart
- Microsoft Visio

**How to create:**
1. Go to dbdiagram.io
2. Copy the code below
3. Paste and it will generate the diagram automatically

```dbdiagram
Table users {
  user_id uuid [pk]
  email varchar [unique, not null]
  password_hash varchar [not null]
  first_name varchar [not null]
  last_name varchar [not null]
  phone varchar
  role varchar [not null]
  department varchar
  employee_id varchar [unique]
  reporting_manager_id uuid [ref: > users.user_id]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table travel_requests {
  request_id uuid [pk]
  user_id uuid [ref: > users.user_id, not null]
  request_number varchar [unique, not null]
  travel_type varchar [not null]
  purpose text [not null]
  destination_country varchar [not null]
  destination_city varchar [not null]
  departure_date date [not null]
  return_date date [not null]
  estimated_cost decimal
  approved_budget decimal
  actual_cost decimal
  currency varchar [default: 'INR']
  status varchar [not null, default: 'DRAFT']
  current_approver_id uuid [ref: > users.user_id]
  special_requirements text
  emergency_contact_name varchar
  emergency_contact_phone varchar
  is_urgent boolean [default: false]
  submitted_at timestamp
  approved_at timestamp
  completed_at timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table approvals {
  approval_id uuid [pk]
  request_id uuid [ref: > travel_requests.request_id, not null]
  approver_id uuid [ref: > users.user_id, not null]
  approval_level integer [not null]
  status varchar [not null, default: 'PENDING']
  comments text
  approved_budget decimal
  conditions text
  reviewed_at timestamp
  created_at timestamp [default: `now()`]
}

Table documents {
  document_id uuid [pk]
  request_id uuid [ref: > travel_requests.request_id, not null]
  uploaded_by uuid [ref: > users.user_id, not null]
  document_type varchar [not null]
  file_name varchar [not null]
  file_size_bytes bigint
  mime_type varchar
  blob_storage_url text [not null]
  ocr_status varchar [default: 'PENDING']
  ocr_extracted_data jsonb
  ocr_confidence_score decimal
  ocr_processed_at timestamp
  verification_status varchar [default: 'PENDING']
  verified_by uuid [ref: > users.user_id]
  verification_comments text
  verified_at timestamp
  upload_attempt integer [default: 1]
  uploaded_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table bookings {
  booking_id uuid [pk]
  request_id uuid [ref: > travel_requests.request_id, not null]
  booked_by uuid [ref: > users.user_id, not null]
  booking_type varchar [not null]
  booking_details jsonb [not null]
  cost decimal [not null]
  currency varchar [default: 'INR']
  status varchar [default: 'CONFIRMED']
  confirmation_number varchar
  vendor_name varchar
  booking_date timestamp [default: `now()`]
  travel_date timestamp
  created_at timestamp [default: `now()`]
}

Table expenses {
  expense_id uuid [pk]
  request_id uuid [ref: > travel_requests.request_id, not null]
  submitted_by uuid [ref: > users.user_id, not null]
  expense_category varchar [not null]
  description text [not null]
  amount decimal [not null]
  currency varchar [default: 'INR']
  converted_amount decimal
  exchange_rate decimal
  expense_date date [not null]
  receipt_document_id uuid [ref: > documents.document_id]
  vendor_name varchar
  status varchar [default: 'SUBMITTED']
  approved_by uuid [ref: > users.user_id]
  approved_amount decimal
  approval_comments text
  approved_at timestamp
  reimbursement_status varchar [default: 'PENDING']
  reimbursed_amount decimal
  reimbursement_date date
  transaction_reference varchar
  submitted_at timestamp [default: `now()`]
  created_at timestamp [default: `now()`]
}

Table notifications {
  notification_id uuid [pk]
  user_id uuid [ref: > users.user_id, not null]
  notification_type varchar [not null]
  title varchar [not null]
  message text [not null]
  related_entity_type varchar
  related_entity_id uuid
  is_read boolean [default: false]
  read_at timestamp
  delivery_method varchar
  delivery_status varchar [default: 'PENDING']
  sent_at timestamp
  created_at timestamp [default: `now()`]
}

Table ai_recommendations {
  recommendation_id uuid [pk]
  request_id uuid [ref: > travel_requests.request_id, not null]
  recommendation_type varchar [not null]
  recommendation_data jsonb [not null]
  confidence_score decimal
  was_selected boolean [default: false]
  selected_option_index integer
  user_feedback text
  generated_at timestamp [default: `now()`]
  expires_at timestamp
}

Table audit_logs {
  log_id uuid [pk]
  user_id uuid [ref: > users.user_id]
  action varchar [not null]
  entity_type varchar [not null]
  entity_id uuid [not null]
  old_values jsonb
  new_values jsonb
  ip_address varchar
  user_agent text
  created_at timestamp [default: `now()`]
}
```

---

## 2. System Architecture Diagram Reference

**Tool:** draw.io (free, web-based)

**Instructions:**
1. Go to app.diagrams.net
2. Create new diagram
3. Use rectangles for components, arrows for connections
4. Follow this structure:

```
Layout (Top to Bottom):

┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│                                                          │
│  [React.js Frontend]  [Mobile Web]  [Admin Dashboard]   │
│                                                          │
└──────────────────────┬───────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────┼────────────────────────────────────┐
│              APPLICATION LAYER                            │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │        Node.js + Express.js Backend                  │ │
│  │                                                       │ │
│  │  [Auth]  [Business Logic]  [APIs]  [Task Queue]     │ │
│  │                                                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└──────────────────────┬────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │PostgreSQL│ │  Azure   │  │ External │
    │ Database │ │  Blob    │  │   APIs   │
    │          │ │ Storage  │  │          │
    │• Users   │ │          │  │• Doc AI  │
    │• Requests│ │• Docs    │  │• Amadeus │
    │• Expenses│ │• Receipts│  │• SMS     │
    └──────────┘ └──────────┘  └──────────┘
```

**Color Coding:**
- Client Layer: Light Blue (#E3F2FD)
- Application Layer: Light Green (#E8F5E9)
- Data Layer: Light Orange (#FFF3E0)
- External APIs: Light Purple (#F3E5F5)

---

## 3. Travel Request Workflow Diagram

**Tool:** draw.io or Lucidchart

**Layout (Vertical Flow):**

```
Start
  │
  ▼
┌─────────────────────┐
│ Employee Creates    │
│ Travel Request      │
│ • Fill details      │
│ • Upload documents  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ OCR Processing      │
│ (Azure Doc AI)      │
└──────────┬──────────┘
           │
      Confidence?
           │
    ┌──────┴──────┐
   >70%          <70%
    │              │
    ▼              ▼
 Auto-Verify   Manual Review
    │              │
    └──────┬───────┘
           │
           ▼
┌─────────────────────┐
│ Manager Approval    │
│ (Level 1)           │
└──────────┬──────────┘
           │
        Approved?
           │
    ┌──────┴──────┐
   YES            NO
    │              │
    ▼              ▼
┌─────────┐    ┌──────┐
│ AVP     │    │Reject│
│Approval │    │ End  │
│(Level 2)│    └──────┘
└────┬────┘
     │
   Approved?
     │
  ┌──┴──┐
 YES    NO
  │     └─→ Reject
  ▼
┌─────────┐
│ SVP     │
│Approval │
│(Level 3)│
└────┬────┘
     │
   Approved?
     │
  ┌──┴──┐
 YES    NO
  │     └─→ Reject
  ▼
┌─────────┐
│ CHRO    │
│Approval │
│(Level 4)│
└────┬────┘
     │
   Approved?
     │
  ┌──┴──┐
 YES    NO
  │     └─→ Reject
  ▼
┌──────────────┐
│ Travel Desk  │
│ Books Travel │
│ • Flights    │
│ • Hotels     │
│ • Visa       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Employee     │
│ Travels      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Submit       │
│ Expenses     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Finance      │
│ Reimburses   │
└──────┬───────┘
       │
       ▼
     End
```

**Shapes:**
- Rectangles: Process steps
- Diamonds: Decision points
- Circles: Start/End
- Arrows: Flow direction

---

## 4. Document Verification Workflow

**Tool:** draw.io

```
     Start
       │
       ▼
┌─────────────────┐
│ Upload Document │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in Azure  │
│ Blob Storage    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Trigger OCR     │
│ Processing      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Data    │
│ (Document AI)   │
└────────┬────────┘
         │
         ▼
    Confidence
      Score?
         │
    ┌────┴────┐
   >70%      <70%
    │          │
    ▼          ▼
  SUCCESS    FAILED
    │          │
    ▼          ▼
 VERIFY   Notify User
    │          │
    │          ▼
    │     Attempt < 2?
    │          │
    │     ┌────┴────┐
    │    YES       NO
    │     │         │
    │     │         ▼
    │     │   Manual Review
    │     │   by Approver
    │     │         │
    │     └────┬────┘
    │          │
    └──────────┘
         │
         ▼
    VERIFIED ✓
         │
         ▼
       End
```

---

## 5. Approval Chain Decision Logic Flowchart

```
      Start
        │
        ▼
┌─────────────────┐
│ Check Travel    │
│ Type            │
└────────┬────────┘
         │
    Travel Type?
         │
    ┌────┴────┐
    │         │
Domestic   International
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│ Cost > │ │ All 4      │
│ 50K?   │ │ Levels     │
└───┬────┘ │            │
    │      │ • Manager  │
┌───┴──┐   │ • AVP      │
│      │   │ • SVP      │
YES   NO   │ • CHRO     │
│      │   └─────┬──────┘
▼      ▼         │
┌────────────┐   │
│ Manager +  │   │
│ AVP        │   │
└─────┬──────┘   │
      │          │
      └──────────┘
           │
           ▼
    Create Approval
        Chain
           │
           ▼
         End
```

---

## 6. Frontend Component Hierarchy

**Tool:** draw.io or any diagramming tool

```
App
│
├── Routes
│   │
│   ├── Public Routes
│   │   └── Login
│   │
│   └── Private Routes (Authenticated)
│       │
│       ├── Dashboard
│       │   ├── StatCards
│       │   ├── RecentRequests
│       │   └── PendingApprovals
│       │
│       ├── Travel Requests
│       │   ├── CreateRequest
│       │   │   ├── TravelDetailsForm
│       │   │   ├── DocumentUploader
│       │   │   └── ReviewSection
│       │   │
│       │   ├── RequestList
│       │   │   └── TravelRequestCard
│       │   │
│       │   └── ViewRequest
│       │       ├── RequestDetails
│       │       ├── ApprovalTimeline
│       │       └── DocumentsList
│       │
│       ├── Approvals
│       │   ├── PendingApprovals
│       │   │   └── ApprovalCard
│       │   │
│       │   └── ApprovalHistory
│       │
│       ├── Bookings
│       │   ├── BookingList
│       │   └── BookingDetails
│       │
│       └── Expenses
│           ├── SubmitExpense
│           │   ├── ExpenseForm
│           │   └── ReceiptUploader
│           │
│           └── ExpenseList
│               └── ExpenseCard
│
└── Layout
    ├── Header
    │   ├── Logo
    │   ├── Navigation
    │   └── UserMenu
    │
    ├── Sidebar
    │   └── MenuItems (Role-based)
    │
    └── Footer
```

---

## 7. API Request/Response Flow Diagram

```
Frontend                 Backend                  Database
   │                        │                        │
   │  POST /travel-requests │                        │
   ├───────────────────────>│                        │
   │                        │                        │
   │                        │  Validate JWT          │
   │                        │  Check permissions     │
   │                        │                        │
   │                        │  INSERT INTO           │
   │                        │  travel_requests       │
   │                        ├───────────────────────>│
   │                        │                        │
   │                        │  Return new_id         │
   │                        │<───────────────────────┤
   │                        │                        │
   │                        │  Send notification     │
   │                        │  (async)               │
   │                        │                        │
   │  201 Created           │                        │
   │  { requestId: "..." }  │                        │
   │<───────────────────────┤                        │
   │                        │                        │
```

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              GitHub Repository                   │
│         (Source Code + CI/CD)                   │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Push to main branch
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           GitHub Actions                         │
│      (Build, Test, Deploy)                      │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌─────────────────┐  ┌─────────────────┐
│ Azure App       │  │ Azure App       │
│ Service         │  │ Service         │
│ (Frontend)      │  │ (Backend)       │
└────────┬────────┘  └────────┬────────┘
         │                    │
         │                    │
         └──────────┬─────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Azure   │ │Azure   │ │Azure   │
    │Postgres│ │ Blob   │ │Doc AI  │
    │Database│ │Storage │ │        │
    └────────┘ └────────┘ └────────┘
```

---

## 9. Week-by-Week Progress Timeline

**Tool:** Excel, Google Sheets, or Project Management tool

```
Week │ Milestone                    │ Status      │ Demo
─────┼──────────────────────────────┼─────────────┼──────────────
  1  │ Foundation & Auth            │ In Progress │ Login system
  2  │ Travel Requests & Approvals  │ Pending     │ Full workflow
  3  │ AI & OCR Integration         │ Pending     │ Document verification
  4  │ Bookings & Expenses          │ Pending     │ Expense tracking
  5  │ Testing & Deployment         │ Pending     │ Production app
```

**Gantt Chart Structure:**
- Week 1: Days 1-7 (Project setup, Database, Auth, Basic UI)
- Week 2: Days 8-14 (Travel module, Document upload, Approvals)
- Week 3: Days 15-21 (OCR, AI recommendations, Manual verification)
- Week 4: Days 22-28 (Bookings, Expenses, Notifications)
- Week 5: Days 29-35 (Testing, Fixes, Polish, Deploy)

---

## 10. User Journey Map

**Tool:** draw.io, Miro, or Figma

```
EMPLOYEE JOURNEY
═══════════════════════════════════════════════════

Phase 1: Request Creation
┌────────────────────────────────────────┐
│ 1. Login to ReGo                       │
│ 2. Click "New Travel Request"          │
│ 3. Fill travel details                 │
│ 4. Upload passport/documents           │
│ 5. Submit for approval                 │
└────────────────────────────────────────┘

Phase 2: Waiting for Approval
┌────────────────────────────────────────┐
│ 1. Receive email notification          │
│ 2. Check status in dashboard           │
│ 3. View approval progress              │
│ 4. Receive approval confirmation       │
└────────────────────────────────────────┘

Phase 3: Travel Preparation
┌────────────────────────────────────────┐
│ 1. View booking details                │
│ 2. Download flight tickets             │
│ 3. Check hotel confirmation            │
│ 4. Review visa status                  │
└────────────────────────────────────────┘

Phase 4: Post-Travel
┌────────────────────────────────────────┐
│ 1. Upload receipts                     │
│ 2. Submit expense claims               │
│ 3. Track reimbursement status          │
│ 4. Receive payment notification        │
└────────────────────────────────────────┘


APPROVER JOURNEY
═══════════════════════════════════════════════════

┌────────────────────────────────────────┐
│ 1. Receive approval notification       │
│ 2. Login and view pending approvals    │
│ 3. Review travel request details       │
│ 4. Check uploaded documents            │
│ 5. Verify budget and policy            │
│ 6. Approve or reject with comments     │
│ 7. Notification sent to next approver  │
└────────────────────────────────────────┘
```

---

## How to Use These References

### For Database Diagram:
1. Go to **dbdiagram.io**
2. Copy the code from section 1
3. Paste in the editor
4. The diagram will auto-generate
5. Export as PNG or PDF

### For Architecture Diagrams:
1. Go to **app.diagrams.net** (draw.io)
2. Create new diagram
3. Use these shapes:
   - **Rectangle**: Components
   - **Cylinder**: Databases
   - **Cloud**: Cloud services
   - **Arrows**: Data flow
4. Follow the ASCII layouts above
5. Add colors as suggested

### For Flowcharts:
1. Use **draw.io** or **Lucidchart**
2. Follow the flow from top to bottom
3. Use these shapes:
   - **Rounded Rectangle**: Start/End
   - **Rectangle**: Process
   - **Diamond**: Decision
   - **Arrow**: Flow direction

### For Timeline/Gantt:
1. Use **Excel**, **Google Sheets**, or **Microsoft Project**
2. Create table with: Week, Tasks, Start Date, End Date, Status
3. Use conditional formatting for visual progress

---

## Quick Tips

**Color Scheme for Professional Look:**
- Primary: #1976D2 (Blue)
- Secondary: #388E3C (Green)
- Accent: #F57C00 (Orange)
- Error: #D32F2F (Red)
- Success: #4CAF50 (Green)
- Warning: #FFA726 (Amber)

**Font Recommendations:**
- Headings: Roboto Bold or Inter Bold
- Body Text: Roboto Regular or Inter Regular
- Code: Fira Code or JetBrains Mono

**Diagram Best Practices:**
- Keep it simple and clean
- Use consistent shapes for similar items
- Add legends for colors/symbols
- Use arrows to show direction
- Include title and date
- Export in high resolution (PNG 300dpi)

---

**All diagrams should be created before Week 1 Demo!**
