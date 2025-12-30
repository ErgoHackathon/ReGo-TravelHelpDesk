/**
 * MockDataService.js - Mock Data for Development/Testing
 * Matches exact backend response structure
 */

import { STATUS_CODES } from '../utils/statusMapper';

// Mock Users
export const MOCK_USERS = {
  employee: {
    empId: '787',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    phone: '+91 9876543210'
  },
  manager: {
    empId: '128',
    name: 'Sarah Manager',
    email: 'sarah.manager@company.com',
    role: 'MANAGER',
    department: 'Engineering'
  },
  svp: {
    empId: '100',
    name: 'Michael SVP',
    email: 'michael.svp@company.com',
    role: 'SVP',
    department: 'Operations'
  },
  travelDesk: {
    empId: '50',
    name: 'Vikram Singh',
    email: 'vikram.singh@demo.com',
    role: 'TRAVEL_DESK',
    department: 'Admin'
  },
  chro: {
    empId: '10',
    name: 'Lisa CHRO',
    email: 'lisa.chro@company.com',
    role: 'CHRO',
    department: 'HR'
  },
  finance: {
    empId: '20',
    name: 'David Finance',
    email: 'david.finance@company.com',
    role: 'FINANCE',
    department: 'Finance'
  }
};

// Mock Travel Requests
export const MOCK_TRAVEL_REQUESTS = [
  {
    tId: 1,
    empId: '787',
    employeeName: 'John Doe',
    country: 'Germany',
    city: 'Berlin',
    remark: 'Client Meeting & Knowledge Transfer',
    suggestedDate: '2025-12-15T00:00:00',
    travelStartDate: '2025-12-20T00:00:00',
    travelEndDate: '2025-12-28T00:00:00',
    finalStartDate: null,
    finalEndDate: null,
    status: STATUS_CODES.TD_RECEIVED_FAKE_DATES,
    rptEmpId: '128',
    priority: 'HIGH',
    estimatedBudget: 250000
  },
  {
    tId: 2,
    empId: '18',
    employeeName: 'Alice Johnson',
    country: 'USA',
    city: 'New York',
    remark: 'Annual Conference',
    suggestedDate: '2025-12-10T00:00:00',
    travelStartDate: '2025-12-15T00:00:00',
    travelEndDate: '2025-12-22T00:00:00',
    finalStartDate: '2025-12-16T00:00:00',
    finalEndDate: '2025-12-23T00:00:00',
    status: STATUS_CODES.TD_REQUESTED_DOCUMENTS,
    rptEmpId: '128',
    priority: 'MEDIUM',
    estimatedBudget: 350000
  },
  {
    tId: 3,
    empId: '25',
    employeeName: 'Bob Smith',
    country: 'Singapore',
    city: 'Singapore',
    remark: 'Partner Meeting',
    suggestedDate: '2025-12-08T00:00:00',
    travelStartDate: '2025-12-12T00:00:00',
    travelEndDate: '2025-12-18T00:00:00',
    finalStartDate: '2025-12-12T00:00:00',
    finalEndDate: '2025-12-18T00:00:00',
    status: STATUS_CODES.TD_OCR_IN_PROGRESS,
    rptEmpId: '100',
    priority: 'HIGH',
    estimatedBudget: 180000
  },
  {
    tId: 4,
    empId: '30',
    employeeName: 'Carol White',
    country: 'UK',
    city: 'London',
    remark: 'Training Program',
    suggestedDate: '2025-12-05T00:00:00',
    travelStartDate: '2025-12-10T00:00:00',
    travelEndDate: '2025-12-17T00:00:00',
    finalStartDate: '2025-12-10T00:00:00',
    finalEndDate: '2025-12-17T00:00:00',
    status: STATUS_CODES.TD_OCR_VERIFIED,
    rptEmpId: '100',
    priority: 'LOW',
    estimatedBudget: 280000
  },
  {
    tId: 5,
    empId: '35',
    employeeName: 'David Brown',
    country: 'Japan',
    city: 'Tokyo',
    remark: 'Tech Summit',
    suggestedDate: '2025-12-01T00:00:00',
    travelStartDate: '2025-12-05T00:00:00',
    travelEndDate: '2025-12-12T00:00:00',
    finalStartDate: '2025-12-05T00:00:00',
    finalEndDate: '2025-12-12T00:00:00',
    status: STATUS_CODES.TD_BOOKING_IN_PROGRESS,
    rptEmpId: '128',
    priority: 'HIGH',
    estimatedBudget: 400000
  },
  {
    tId: 6,
    empId: '40',
    employeeName: 'Emma Davis',
    country: 'Australia',
    city: 'Sydney',
    remark: 'Product Launch',
    suggestedDate: '2025-11-28T00:00:00',
    travelStartDate: '2025-12-02T00:00:00',
    travelEndDate: '2025-12-08T00:00:00',
    finalStartDate: '2025-12-02T00:00:00',
    finalEndDate: '2025-12-08T00:00:00',
    status: STATUS_CODES.TD_BOOKED,
    rptEmpId: '100',
    priority: 'MEDIUM',
    estimatedBudget: 320000,
    bookingDetails: {
      airline: 'Qantas',
      flightNumber: 'QF123',
      pnr: 'ABC456',
      hotelName: 'Hilton Sydney',
      hotelConfirmation: 'HTL789'
    }
  }
];

// Mock Passport Info
export const MOCK_PASSPORT_INFO = {
  '787': {
    passportNumber: 'J1234567',
    fullName: 'John Doe',
    dateOfBirth: '1990-05-15',
    placeOfBirth: 'Mumbai',
    nationality: 'Indian',
    issueDate: '2020-03-10',
    expiryDate: '2030-03-09',
    issuingAuthority: 'Mumbai',
    address: '123 Main Street, Mumbai 400001',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '1234 5678 9012',
    ocrVerified: true,
    ocrConfidence: 95.5
  }
};

// Mock Documents
export const MOCK_DOCUMENTS = [
  { documentId: 1, documentName: 'Passport', required: true },
  { documentId: 2, documentName: 'PAN Card', required: true },
  { documentId: 3, documentName: 'Aadhaar Card', required: true },
  { documentId: 4, documentName: 'Visa', required: false },
  { documentId: 5, documentName: 'Travel Insurance', required: false },
  { documentId: 6, documentName: 'Flight Ticket', required: false },
  { documentId: 7, documentName: 'Hotel Booking', required: false }
];

// Mock Employee Documents
export const MOCK_EMPLOYEE_DOCUMENTS = {
  '787': [
    { documentId: 1, fileName: 'passport.pdf', fileSize: 2048000, uploadDate: '2025-12-01', verified: true },
    { documentId: 2, fileName: 'pan_card.jpg', fileSize: 512000, uploadDate: '2025-12-01', verified: true },
    { documentId: 3, fileName: 'aadhaar.pdf', fileSize: 1024000, uploadDate: '2025-12-02', verified: false }
  ]
};

// Mock API Response Wrapper
export const wrapResponse = (data, success = true) => ({
  Status: success ? 'Success' : 'Failure',
  Result: data
});

// Mock API Service
const mockDataService = {
  // Auth
  login: async (email, password) => {
    await delay(500);
    const user = Object.values(MOCK_USERS).find(u => u.email === email);
    if (user) {
      return wrapResponse({ ...user, token: 'mock-jwt-token-' + Date.now() });
    }
    return wrapResponse(null, false);
  },

  // Travel Requests
  getAllTravelDetails: async () => {
    await delay(300);
    return wrapResponse(MOCK_TRAVEL_REQUESTS);
  },

  getTravelDetailByTId: async (tId) => {
    await delay(200);
    const request = MOCK_TRAVEL_REQUESTS.find(r => r.tId === parseInt(tId));
    return wrapResponse(request || null);
  },

  getTravelDetailByEmpId: async (empId) => {
    await delay(200);
    const requests = MOCK_TRAVEL_REQUESTS.filter(r => r.empId === empId);
    return wrapResponse(requests);
  },

  // Employee
  getEmployeeData: async (idOrEmail) => {
    await delay(150);
    const user = Object.values(MOCK_USERS).find(
      u => u.empId === idOrEmail || u.email === idOrEmail
    );
    return wrapResponse(user || { empId: idOrEmail, name: `Employee ${idOrEmail}` });
  },

  // Passport Info
  getPassportInfo: async (empId) => {
    await delay(200);
    return wrapResponse(MOCK_PASSPORT_INFO[empId] || null);
  },

  // Documents
  getAllDocumentsList: async () => {
    await delay(100);
    return wrapResponse(MOCK_DOCUMENTS);
  },

  getEmployeeDocuments: async (empId) => {
    await delay(200);
    return wrapResponse(MOCK_EMPLOYEE_DOCUMENTS[empId] || []);
  },

  // Travel Desk Actions
  updateTravelStatus: async (tId, newStatus) => {
    await delay(300);
    const index = MOCK_TRAVEL_REQUESTS.findIndex(r => r.tId === parseInt(tId));
    if (index !== -1) {
      MOCK_TRAVEL_REQUESTS[index].status = newStatus;
      return wrapResponse({ message: 'Status updated successfully' });
    }
    return wrapResponse(null, false);
  },

  performTravelDeskAction: async (actionName, requestId, payload = {}) => {
    await delay(400);
    const index = MOCK_TRAVEL_REQUESTS.findIndex(r => r.tId === parseInt(requestId));
    if (index === -1) {
      return wrapResponse({ message: 'Request not found' }, false);
    }

    const request = MOCK_TRAVEL_REQUESTS[index];
    let newStatus = request.status;

    switch (actionName) {
      case 'RECEIVE_FAKE_DATES':
        newStatus = STATUS_CODES.TD_RECEIVED_FAKE_DATES;
        break;
      case 'REQUEST_REAL_DATES':
        newStatus = STATUS_CODES.TD_REQUESTED_REAL_DATES;
        break;
      case 'REQUEST_DOCUMENTS':
        newStatus = STATUS_CODES.TD_REQUESTED_DOCUMENTS;
        break;
      case 'START_OCR':
        newStatus = STATUS_CODES.TD_OCR_IN_PROGRESS;
        break;
      case 'COMPLETE_OCR':
        newStatus = STATUS_CODES.TD_OCR_VERIFIED;
        break;
      case 'FAIL_OCR':
        newStatus = STATUS_CODES.TD_OCR_FAILED;
        break;
      case 'START_BOOKING':
        newStatus = STATUS_CODES.TD_BOOKING_IN_PROGRESS;
        break;
      case 'COMPLETE_BOOKING':
        newStatus = STATUS_CODES.TD_BOOKED;
        if (payload.bookingDetails) {
          MOCK_TRAVEL_REQUESTS[index].bookingDetails = payload.bookingDetails;
        }
        break;
      case 'MARK_COMPLETED':
        newStatus = STATUS_CODES.COMPLETED;
        break;
      default:
        break;
    }

    MOCK_TRAVEL_REQUESTS[index].status = newStatus;
    return wrapResponse({ 
      message: `Action ${actionName} completed successfully`,
      newStatus 
    });
  },

  // Dashboard Stats
  getDashboardStats: async (userId, role) => {
    await delay(200);
    
    if (role === 'TRAVEL_DESK') {
      const requests = MOCK_TRAVEL_REQUESTS;
      return wrapResponse({
        total: requests.length,
        pendingDates: requests.filter(r => 
          [STATUS_CODES.TD_RECEIVED_FAKE_DATES, STATUS_CODES.TD_REQUESTED_REAL_DATES].includes(r.status)
        ).length,
        pendingDocuments: requests.filter(r => 
          [STATUS_CODES.TD_REQUESTED_DOCUMENTS, STATUS_CODES.TD_DOCUMENTS_RECEIVED].includes(r.status)
        ).length,
        pendingOCR: requests.filter(r => r.status === STATUS_CODES.TD_OCR_IN_PROGRESS).length,
        pendingBooking: requests.filter(r => 
          [STATUS_CODES.TD_OCR_VERIFIED, STATUS_CODES.TD_BOOKING_IN_PROGRESS].includes(r.status)
        ).length,
        completed: requests.filter(r => 
          [STATUS_CODES.TD_BOOKED, STATUS_CODES.COMPLETED].includes(r.status)
        ).length
      });
    }

    return wrapResponse({
      totalRequests: 5,
      pending: 2,
      approved: 2,
      rejected: 1
    });
  }
};

// Helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default mockDataService;