/**
 * Mock API - All mock data centralized here
 * Returns SAME structure as real backend
 * 
 * Response format matches backend:
 * { status: 'Success' | 'Functional Failure', result: data, error: null }
 */

// ============================================
// PERSISTED STORAGE HELPERS
// ============================================

const loadFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage');
  }
};

// ============================================
// MOCK DATABASE
// ============================================

const mockDB = {
  // Employees with complete hierarchy
  employees: [
    { empId: '787', name: 'Abhishek Kumar', email: 'abhishek.kumar@demo.com', rptEmpId: '828', refRoleId: 101, password: 'Pass@123', department: 'Engineering', designation: 'Software Engineer' },
    { empId: '828', name: 'Sneha Patel', email: 'sneha.patel@demo.com', rptEmpId: '2', refRoleId: 102, password: 'Sneha@123', department: 'Engineering', designation: 'Manager' },
    { empId: '2', name: 'Akash Kumar', email: 'akash.kumar@demo.com', rptEmpId: '1', refRoleId: 105, password: 'Akash@123', department: 'Technology', designation: 'SVP' },
    { empId: '128', name: 'Rahul Mehta', email: 'rahul.mehta@demo.com', rptEmpId: '600', refRoleId: 104, password: 'Rahul@123', department: 'Product', designation: 'AVP' },
    { empId: '436', name: 'Priya Sharma', email: 'priya.sharma@demo.com', rptEmpId: '128', refRoleId: 101, password: 'Priya@123', department: 'Product', designation: 'Product Manager' },
    { empId: '320', name: 'Vikram Singh', email: 'vikram.singh@demo.com', rptEmpId: '', refRoleId: 103, password: 'Vikram@123', department: 'Operations', designation: 'Travel Desk Executive' },
    { empId: '600', name: 'Ravi Verma', email: 'ravi.verma@demo.com', rptEmpId: '2', refRoleId: 105, password: 'Ravi@123', department: 'Product', designation: 'SVP' },
    { empId: '1', name: 'Amit Desai', email: 'amit.desai@demo.com', rptEmpId: '', refRoleId: 105, password: 'Amit@123', department: 'Executive', designation: 'CHRO' },
  ],

  // Travel requests with realistic status distribution
  travels: loadFromStorage('mockTravels', [
    {
      tId: 1001,
      empId: '787',
      employeeName: 'Abhishek Kumar',
      country: 'Germany',
      city: 'Berlin',
      remark: 'Client meeting with XYZ Corp',
      suggestedDate: '2025-11-28T00:00:00',
      travelStartDate: '2025-12-01T00:00:00',
      travelEndDate: '2025-12-05T00:00:00',
      finalStartDate: null,
      finalEndDate: null,
      status: 13, // Documents pending from employee
      rptEmpId: '828',
      createdAt: '2025-11-20T10:00:00'
    },
    {
      tId: 1002,
      empId: '436',
      employeeName: 'Priya Sharma',
      country: 'Germany',
      city: 'Munich',
      remark: 'Project kickoff meeting',
      suggestedDate: '2025-11-27T00:00:00',
      travelStartDate: '2025-12-10T00:00:00',
      travelEndDate: '2025-12-20T00:00:00',
      finalStartDate: null,
      finalEndDate: null,
      status: 14, // Documents submitted, helpdesk reviewing
      rptEmpId: '128',
      createdAt: '2025-11-18T09:30:00'
    },
    {
      tId: 1003,
      empId: '828',
      employeeName: 'Sneha Patel',
      country: 'USA',
      city: 'New York',
      remark: 'Annual conference attendance',
      suggestedDate: '2025-11-25T00:00:00',
      travelStartDate: '2025-12-15T00:00:00',
      travelEndDate: '2025-12-20T00:00:00',
      finalStartDate: null,
      finalEndDate: null,
      status: 6, // SVP approved, ready for helpdesk
      rptEmpId: '2',
      createdAt: '2025-11-15T14:00:00'
    },
    {
      tId: 1004,
      empId: '787',
      employeeName: 'Abhishek Kumar',
      country: 'UK',
      city: 'London',
      remark: 'Training program',
      suggestedDate: '2025-10-15T00:00:00',
      travelStartDate: '2025-10-20T00:00:00',
      travelEndDate: '2025-10-25T00:00:00',
      finalStartDate: '2025-10-20T00:00:00',
      finalEndDate: '2025-10-25T00:00:00',
      status: 16, // Tickets uploaded
      rptEmpId: '828',
      createdAt: '2025-10-10T11:00:00'
    },
    {
      tId: 1005,
      empId: '436',
      employeeName: 'Priya Sharma',
      country: 'Japan',
      city: 'Tokyo',
      remark: 'Tech summit',
      suggestedDate: '2025-09-01T00:00:00',
      travelStartDate: '2025-09-10T00:00:00',
      travelEndDate: '2025-09-15T00:00:00',
      finalStartDate: '2025-09-10T00:00:00',
      finalEndDate: '2025-09-15T00:00:00',
      status: 17, // Completed
      rptEmpId: '128',
      createdAt: '2025-08-25T09:00:00'
    },
    {
      tId: 1006,
      empId: '128',
      employeeName: 'Rahul Mehta',
      country: 'Singapore',
      city: 'Singapore',
      remark: 'Leadership summit',
      suggestedDate: '2025-12-05T00:00:00',
      travelStartDate: '2025-12-08T00:00:00',
      travelEndDate: '2025-12-12T00:00:00',
      finalStartDate: null,
      finalEndDate: null,
      status: 15, // Booking in progress
      rptEmpId: '600',
      createdAt: '2025-11-28T08:00:00'
    },
    {
      tId: 1007,
      empId: '828',
      employeeName: 'Sneha Patel',
      country: 'Australia',
      city: 'Sydney',
      remark: 'Partner meeting',
      suggestedDate: '2025-12-20T00:00:00',
      travelStartDate: '2025-12-22T00:00:00',
      travelEndDate: '2025-12-28T00:00:00',
      finalStartDate: null,
      finalEndDate: null,
      status: 9, // SVP final initiated (waiting for final dates)
      rptEmpId: '2',
      createdAt: '2025-11-30T16:00:00'
    },
  ]),

  documents: [
    { documentID: 1, documentName: 'Passport' },
    { documentID: 2, documentName: 'Invitation Letter' },
    { documentID: 3, documentName: 'Cover Letter' },
    { documentID: 4, documentName: 'KT Plan' },
    { documentID: 5, documentName: 'Hotel Booking' },
    { documentID: 6, documentName: 'Flight Booking' },
    { documentID: 7, documentName: 'Travel Insurance' },
    { documentID: 8, documentName: 'Visa Form' },
    { documentID: 9, documentName: 'Letter of Intent' },
    { documentID: 10, documentName: 'Visa' },
    { documentID: 11, documentName: 'Insurance Declaration' },
    { documentID: 12, documentName: 'Visa Appointment' },
  ],

  roles: [
    { rollID: 101, rollName: 'Employee' },
    { rollID: 102, rollName: 'Manager' },
    { rollID: 103, rollName: 'Helpdesk' },
    { rollID: 104, rollName: 'DVP/AVP' },
    { rollID: 105, rollName: 'SVP' },
  ],

  // Status master (for reference)
  statuses: [
    { statusId: 1, statusName: 'Initial Manager Initiated' },
    { statusId: 2, statusName: 'Initial AVP/DVP Initiated' },
    { statusId: 3, statusName: 'Initial SVP Initiated' },
    { statusId: 4, statusName: 'Initial Manager Approved' },
    { statusId: 5, statusName: 'Initial AVP/DVP Approved' },
    { statusId: 6, statusName: 'Initial SVP Approved' },
    { statusId: 7, statusName: 'Manager Final Initiated' },
    { statusId: 8, statusName: 'AVP/DVP Final Initiated' },
    { statusId: 9, statusName: 'SVP Final Initiated' },
    { statusId: 10, statusName: 'Final Manager Approved' },
    { statusId: 11, statusName: 'Final AVP/DVP Approved' },
    { statusId: 12, statusName: 'Final SVP Approved' },
    { statusId: 13, statusName: 'Document Pending from Employee' },
    { statusId: 14, statusName: 'Document Review Pending from Helpdesk' },
    { statusId: 15, statusName: 'Pending Tickets from Helpdesk' },
    { statusId: 16, statusName: 'Tickets Uploaded from Helpdesk' },
    { statusId: 17, statusName: 'Employee Travel Completed' },
    { statusId: 18, statusName: 'Visa Rejected' },
  ],

  // Persisted employee documents
  employeeDocuments: loadFromStorage('mockEmployeeDocuments', []),

  // Passport OCR data
  passportOCR: loadFromStorage('mockPassportOCR', {}),

  // Visa OCR data
  visaOCR: loadFromStorage('mockVisaOCR', {}),
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to persist travels
const persistTravels = () => {
  saveToStorage('mockTravels', mockDB.travels);
};

// ============================================
// MOCK API FUNCTIONS
// ============================================

const mockApi = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  // POST /api/LoginRequest
  login: async (username, password) => {
    await delay(500);
    console.log('🔵 MOCK: POST /api/LoginRequest');

    const employee = mockDB.employees.find(
      e => e.email.toLowerCase() === username.toLowerCase() && e.password === password
    );

    return employee
      ? { status: 'Success', result: employee.refRoleId }
      : { status: 'Failure', result: null };
  },

  // ==========================================
  // EMPLOYEE
  // ==========================================

  // POST /api/employee/GetEmployeeData
  getEmployeeData: async (idOrEmail) => {
    await delay(300);
    console.log('🔵 MOCK: POST /api/employee/GetEmployeeData', idOrEmail);

    const employee = mockDB.employees.find(
      e => e.empId === idOrEmail || e.email.toLowerCase() === idOrEmail?.toLowerCase()
    );

    return employee
      ? {
        status: 'Success',
        result: {  // Changed from Result to result
          EmpId: employee.empId,
          empId: employee.empId,
          Name: employee.name,
          name: employee.name,
          Email: employee.email,
          email: employee.email,
          RptEmpId: employee.rptEmpId,
          rptEmpId: employee.rptEmpId,
          RefRoleId: employee.refRoleId,
          refRoleId: employee.refRoleId,
          Department: employee.department,
          department: employee.department,
          Designation: employee.designation,
          designation: employee.designation,
        }
      }
      : { status: 'Functional Failure', result: null };  // Changed from Result to result
  },

  // POST /api/employee/TravelDetailByEmpId?id=xxx
  getTravelDetailByEmpId: async (empId) => {
    await delay(300);
    console.log('🔵 MOCK: POST /api/employee/TravelDetailByEmpId?id=' + empId);

    const travels = mockDB.travels.filter(t => t.empId === empId);

    return travels.length > 0
      ? { status: 'Success', result: travels, Result: travels }
      : { status: 'Functional Failure', result: [], Result: [] };
  },

  // GET /api/TravelDetailByTId?TiD=xxx
  getTravelDetailByTId: async (tId) => {
    await delay(300);
    console.log('🔵 MOCK: GET /api/TravelDetailByTId?TiD=' + tId);

    const travel = mockDB.travels.find(t => t.tId === parseInt(tId));

    return travel
      ? { status: 'Success', result: travel, Result: travel }
      : { status: 'Functional Failure', result: null, Result: null };
  },

  // ==========================================
  // MANAGER
  // ==========================================

  // POST /api/manager/GetEmployeesByRptId
  getEmployeesByRptId: async (managerId) => {
    await delay(300);
    console.log('🔵 MOCK: POST /api/manager/GetEmployeesByRptId', managerId);

    const team = mockDB.employees.filter(e => e.rptEmpId === managerId);

    return team.length > 0
      ? { status: 'Success', result: team.map(e => ({ empId: e.empId, name: e.name, email: e.email, department: e.department })) }
      : { status: 'Functional Failure', result: [] };
  },

  // POST /api/manager/TravelDetailByRptId
  getTravelDetailByRptId: async (managerId) => {
    await delay(300);
    console.log('🔵 MOCK: POST /api/manager/TravelDetailByRptId', managerId);

    const travels = mockDB.travels.filter(t => t.rptEmpId === managerId);

    return travels.length > 0
      ? { status: 'Success', result: travels }
      : { status: 'Functional Failure', result: [] };
  },

  // POST /api/manager/InsertTravelDetail
  insertTravelDetail: async (travelData) => {
    await delay(500);
    console.log('🔵 MOCK: POST /api/manager/InsertTravelDetail', travelData);

    const newTravel = {
      tId: Date.now(),
      ...travelData,
      status: travelData.status || 1,
      createdAt: new Date().toISOString(),
    };

    mockDB.travels.push(newTravel);
    persistTravels();

    return { status: 'Success', result: 'Inserted', tId: newTravel.tId };
  },

  // ==========================================
  // SVP / AVP SPECIFIC
  // ==========================================

  getSvpEmployees: async (rptSvpId) => {
    await delay(300);
    console.log('🔵 MOCK: GET /api/svp/GetEmployeesByRptSvpId', rptSvpId);

    const employees = mockDB.employees.filter(e => e.rptEmpId === rptSvpId);
    return { status: 'Success', result: employees };
  },

  getAvpEmployees: async (rptAvpId) => {
    await delay(300);
    console.log('🔵 MOCK: GET /api/avp/GetEmployeesByRptAvpId', rptAvpId);

    const employees = mockDB.employees.filter(e => e.rptEmpId === rptAvpId);
    return { status: 'Success', result: employees };
  },

  // ==========================================
  // COMMON / TRAVEL STATUS
  // ==========================================

  // POST /api/UpdateTravelStatus
  updateTravelStatus: async (tId, status, empId, comment = '') => {
    await delay(400);
    console.log('🔵 MOCK: POST /api/UpdateTravelStatus', { tId, status, empId, comment });

    // Find by tId first, then by empId
    let travel = mockDB.travels.find(t => t.tId === parseInt(tId));
    if (!travel && empId) {
      travel = mockDB.travels.find(t => t.empId === empId);
    }

    if (travel) {
      travel.status = status;
      travel.lastUpdated = new Date().toISOString();
      travel.lastComment = comment;
      persistTravels();
      console.log('✅ Status updated:', { tId: travel.tId, newStatus: status });
    }

    return { status: 'Success', result: 'Updated' };
  },

  // GET /api/GetAllTravelDetails (for Travel Desk)
  getAllTravelDetails: async () => {
    await delay(300);
    console.log('🔵 MOCK: GET /api/GetAllTravelDetails');

    return {
      status: 'Success',
      result: mockDB.travels,
      Result: mockDB.travels
    };
  },

  // GET /api/GetAllDocumentsList
  getAllDocumentsList: async () => {
    await delay(300);
    console.log('🔵 MOCK: GET /api/GetAllDocumentsList');

    return { status: 'Success', result: mockDB.documents };
  },

  // GET /api/GetRoleMaster
  getRoleMaster: async () => {
    await delay(200);
    console.log('🔵 MOCK: GET /api/GetRoleMaster');

    return { status: 'Success', result: mockDB.roles };
  },

  // GET /api/GetStatusMaster
  getStatusMaster: async () => {
    await delay(200);
    console.log('🔵 MOCK: GET /api/GetStatusMaster');

    return { status: 'Success', result: mockDB.statuses };
  },

  // POST /api/manager/UpdateFinalDates
  updateFinalDates: async (tId, finalStartDate, finalEndDate) => {
    await delay(400);
    console.log('🔵 MOCK: POST /api/manager/UpdateFinalDates', { tId, finalStartDate, finalEndDate });

    const travel = mockDB.travels.find(t => t.tId === parseInt(tId));
    if (travel) {
      travel.finalStartDate = finalStartDate;
      travel.finalEndDate = finalEndDate;
      travel.lastUpdated = new Date().toISOString();
      persistTravels();
      console.log('✅ Final dates updated');
      return { status: 'Success', result: 'Final dates updated' };
    }

    return { status: 'Functional Failure', result: 'Travel not found' };
  },

  // ==========================================
  // DOCUMENT MANAGEMENT
  // ==========================================

  // POST /api/employee/AddDocument
  addDocument: async (empId, documentId, document) => {
    await delay(800);
    console.log('🔵 MOCK: POST /api/employee/AddDocument', { empId, documentId });

    const docType = mockDB.documents.find(d => d.documentID === documentId);

    const newDoc = {
      empDocId: Date.now(),
      empId: empId,
      documentId: documentId,
      documentName: docType?.documentName || 'Unknown',
      documentSize: document?.length || 0,
      documentPreview: typeof document === 'string' ? document.substring(0, 100) + '...' : '',
      base64String: document,
      createdOn: new Date().toISOString(),
      status: 'UPLOADED'
    };

    mockDB.employeeDocuments.push(newDoc);
    saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

    console.log('✅ Document SAVED:', {
      empId: newDoc.empId,
      documentId: newDoc.documentId,
      documentName: newDoc.documentName,
    });

    return { status: 'Success', result: 'Document Added' };
  },

  // POST /api/employee/AddDocumentWithMetadata
  addDocumentWithMetadata: async (empId, documentId, document, fileType, fileName, fileSize) => {
    await delay(800);
    console.log('🔵 MOCK: POST /api/employee/AddDocumentWithMetadata', { empId, documentId, fileName });

    const docType = mockDB.documents.find(d => d.documentID === documentId);

    const newDoc = {
      empDocId: Date.now(),
      empId: empId,
      documentId: documentId,
      documentName: docType?.documentName || 'Unknown',
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      base64String: document,
      createdOn: new Date().toISOString(),
      status: 'UPLOADED'
    };

    // Remove existing doc of same type
    mockDB.employeeDocuments = mockDB.employeeDocuments.filter(
      d => !(d.empId === empId && d.documentId === documentId)
    );

    mockDB.employeeDocuments.push(newDoc);
    saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

    console.log('✅ Document SAVED with metadata:', {
      empId: newDoc.empId,
      documentId: newDoc.documentId,
      fileName: newDoc.fileName,
    });

    return { status: 'Success', result: 'Document Added' };
  },

  // POST /api/employee/UpdateDocument
  updateDocument: async (empId, documentId, document) => {
    await delay(800);
    console.log('🔵 MOCK: POST /api/employee/UpdateDocument', { empId, documentId });

    const index = mockDB.employeeDocuments.findIndex(
      d => d.empId === empId && d.documentId === documentId
    );

    const docType = mockDB.documents.find(d => d.documentID === documentId);

    if (index !== -1) {
      mockDB.employeeDocuments[index] = {
        ...mockDB.employeeDocuments[index],
        documentSize: document?.length || 0,
        base64String: document,
        updatedOn: new Date().toISOString(),
        status: 'UPDATED'
      };
    } else {
      const newDoc = {
        empDocId: Date.now(),
        empId: empId,
        documentId: documentId,
        documentName: docType?.documentName || 'Unknown',
        base64String: document,
        createdOn: new Date().toISOString(),
        status: 'UPLOADED'
      };
      mockDB.employeeDocuments.push(newDoc);
    }

    saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

    return { status: 'Success', result: 'Document Updated' };
  },

  // POST /api/HelpDesk/GetEmployeeDocuments
  getEmployeeDocuments: async (empId, docId) => {
    await delay(300);
    console.log('🔵 MOCK: POST /api/HelpDesk/GetEmployeeDocuments', { empId, docId });

    const doc = mockDB.employeeDocuments.find(
      d => d.empId === empId && d.documentId === docId
    );

    return doc
      ? { status: 'Success', result: doc, Result: doc }
      : { status: 'Functional Failure', result: null, Result: null };
  },

  // GET all documents for an employee
  getEmployeeAllDocuments: async (empId) => {
    await delay(300);
    console.log('🔵 MOCK: GET all documents for employee:', empId);

    const docs = mockDB.employeeDocuments.filter(d => d.empId === empId);

    return { status: 'Success', result: docs, Result: docs };
  },

  // DELETE document
  deleteDocument: async (empId, documentId) => {
    await delay(300);
    console.log('🔵 MOCK: DELETE document', { empId, documentId });

    mockDB.employeeDocuments = mockDB.employeeDocuments.filter(
      d => !(d.empId === empId && d.documentId === documentId)
    );

    saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

    return { status: 'Success', result: 'Document Deleted' };
  },

  // ==========================================
  // PASSPORT OCR
  // ==========================================

  getPassportInfo: async (empId) => {
    await delay(400);
    console.log('🔵 MOCK: GET /api/employee/GetPassportOCR', empId);

    // Check if already stored
    if (mockDB.passportOCR[empId]) {
      return { status: 'Success', result: mockDB.passportOCR[empId], Result: mockDB.passportOCR[empId] };
    }

    // Generate mock OCR data if passport uploaded
    const passportDoc = mockDB.employeeDocuments.find(
      d => d.empId === empId && d.documentId === 1
    );

    if (passportDoc) {
      const mockOCR = {
        fullName: mockDB.employees.find(e => e.empId === empId)?.name || 'Unknown',
        passportNumber: 'M' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        nationality: 'INDIAN',
        dateOfBirth: '1990-05-15T00:00:00',
        sex: Math.random() > 0.5 ? 'M' : 'F',
        expiryDate: '2030-05-15T00:00:00',
        issuer: 'INDIA',
        compositeCheck: true,
        isVerified: false,
      };

      mockDB.passportOCR[empId] = mockOCR;
      saveToStorage('mockPassportOCR', mockDB.passportOCR);

      return { status: 'Success', result: mockOCR, Result: mockOCR };
    }

    return { status: 'Functional Failure', result: null, Result: null };
  },

  updatePassportInfo: async (empId, passportData) => {
    await delay(400);
    console.log('🔵 MOCK: POST /api/employee/UpdatePassportOCR', { empId, passportData });

    mockDB.passportOCR[empId] = {
      ...mockDB.passportOCR[empId],
      ...passportData,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage('mockPassportOCR', mockDB.passportOCR);

    return { status: 'Success', result: 'Passport info updated' };
  },

  // ==========================================
  // VISA OCR
  // ==========================================

  getVisaInfo: async (empId) => {
    await delay(400);
    console.log('🔵 MOCK: GET /api/travelDesk/GetVisaOCR', empId);

    if (mockDB.visaOCR[empId]) {
      return { status: 'Success', result: mockDB.visaOCR[empId], Result: mockDB.visaOCR[empId] };
    }

    // Check if visa uploaded
    const visaDoc = mockDB.employeeDocuments.find(
      d => d.empId === empId && d.documentId === 10
    );

    if (visaDoc) {
      const employee = mockDB.employees.find(e => e.empId === empId);
      const mockOCR = {
        fullName: employee?.name || 'Unknown',
        visaNumber: 'V' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        nationality: 'INDIAN',
        dateOfBirth: '1990-05-15T00:00:00',
        sex: Math.random() > 0.5 ? 'M' : 'F',
        expiryDate: '2026-05-15T00:00:00',
        issuer: 'GERMANY',
        visaType: 'BUSINESS',
        compositeCheck: true,
        isVerified: false,
      };

      mockDB.visaOCR[empId] = mockOCR;
      saveToStorage('mockVisaOCR', mockDB.visaOCR);

      return { status: 'Success', result: mockOCR, Result: mockOCR };
    }

    return { status: 'Functional Failure', result: null, Result: null };
  },

  updateVisaInfo: async (empId, visaData) => {
    await delay(400);
    console.log('🔵 MOCK: POST /api/travelDesk/UpdateVisaOCR', { empId, visaData });

    mockDB.visaOCR[empId] = {
      ...mockDB.visaOCR[empId],
      ...visaData,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage('mockVisaOCR', mockDB.visaOCR);

    return { status: 'Success', result: 'Visa info updated' };
  },

  // ==========================================
  // SUBMIT DOCUMENTS (Status 13 → 14)
  // ==========================================

  submitDocuments: async (tId, empId) => {
    await delay(500);
    console.log('🔵 MOCK: POST /api/employee/SubmitDocuments', { tId, empId });

    // Find travel and update status
    let travel = mockDB.travels.find(t => t.tId === parseInt(tId));
    if (!travel && empId) {
      travel = mockDB.travels.find(t => t.empId === empId && t.status === 13);
    }

    if (travel) {
      travel.status = 14;
      travel.documentsSubmittedAt = new Date().toISOString();
      persistTravels();
      console.log('✅ Documents submitted, status → 14');
    }

    return { status: 'Success', result: 'Documents Submitted' };
  },
};

export default mockApi;
export { mockDB };