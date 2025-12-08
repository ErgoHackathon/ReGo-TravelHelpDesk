┌─────────────────────┐
│   TMS_RollMaster    │
├─────────────────────┤
│ PK: RollID          │
│     RollName        │
└─────────┬───────────┘
          │
          │ 1:N
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│ TMS_EmployeeMaster  │     │   TMS_LoginMaster   │
├─────────────────────┤     ├─────────────────────┤
│ PK: EmpId           │     │ PK: EmpId           │
│     Name            │     │     Name            │
│     Email           │     │     Email           │
│ FK: RefRoleId ──────┼─────│ FK: RefRoleId       │
└─────────┬───────────┘     └─────────────────────┘
          │
          │ 1:N
          ▼
┌─────────────────────────────┐
│ TMS_EmployeeDocumentMaster  │
├─────────────────────────────┤
│ PK: EmpDocId                │
│ FK: EmpId                   │◄──────┐
│ FK: DocumentID              │───────┼──┐
│     Document                │       │  │
└─────────────────────────────┘       │  │
                                      │  │
┌─────────────────────┐               │  │
│ TMS_DocumentMaster  │───────────────┘  │
├─────────────────────┤                  │
│ PK: DocumentID      │◄─────────────────┘
│     DocumentName    │
└─────────────────────┘

┌─────────────────────┐
│  TMS_TravelMaster   │
├─────────────────────┤
│ PK: TravelId        │
│     EmpId           │
│     Country         │
│     City            │
│     Status          │
└─────────────────────┘