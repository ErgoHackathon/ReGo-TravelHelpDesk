/**
 * Real API - All actual HTTP calls
 * Complete version with Visa OCR support
 * UPDATED: Use employee endpoints for all document operations
 */

import apiClient from '../../api/client';

const realApi = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  
  login: async (username, password) => {
    console.log('🟢 REAL: POST /api/LoginRequest');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await apiClient.post('/api/LoginRequest', formData);
    return response.data;
  },

  // ==========================================
  // EMPLOYEE
  // ==========================================

  getEmployeeData: async (idOrEmail) => {
    console.log('🟢 REAL: POST /api/employee/GetEmployeeData');
    const formData = new FormData();
    formData.append('IDorEmail', idOrEmail);
    const response = await apiClient.post('/api/employee/GetEmployeeData', formData);
    return response.data;
  },

  getTravelDetailByEmpId: async (empId) => {
    console.log('🟢 REAL: POST /api/employee/TravelDetailByEmpId?id=' + empId);
    const response = await apiClient.post(`/api/employee/TravelDetailByEmpId?id=${empId}`, null);
    return response.data;
  },

  getTravelDetailByTId: async (TiD) => {
    const formData = new FormData();
    formData.append('TID', TiD);
    console.log('🟢 REAL: POST /api/employee/TravelDetailByTID ' + TiD);
    const response = await apiClient.post(`/api/employee/TravelDetailByTID`, formData);
    return response.data;
  },

  // ==========================================
  // MANAGER
  // ==========================================

  getEmployeesByRptId: async (managerId) => {
    console.log('🟢 REAL: POST /api/manager/GetEmployeesByRptId');
    const formData = new FormData();
    formData.append('RptId', managerId);
    const response = await apiClient.post('/api/manager/GetEmployeesByRptId', formData);
    return response.data;
  },

  getTravelDetailByRptId: async (managerId) => {
    console.log('🟢 REAL: POST /api/manager/TravelDetailByRptId');
    const formData = new FormData();
    formData.append('RptId', managerId);
    const response = await apiClient.post('/api/manager/TravelDetailByRptId', formData);
    return response.data;
  },

  insertTravelDetail: async (travelData) => {
    console.log('🟢 REAL: POST /api/manager/InsertTravelDetail');
    const dataArray = Array.isArray(travelData) ? travelData : [travelData];
    const response = await apiClient.post('/api/manager/InsertTravelDetail', dataArray, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // ==========================================
  // SVP / AVP SPECIFIC
  // ==========================================

  getSvpEmployees: async (rptSvpId) => {
    console.log('🟢 REAL: POST /api/manager/GetSvpEmployees');
    const formData = new FormData();
    formData.append('RptSvpId', rptSvpId);
    const response = await apiClient.post('/api/manager/GetSvpEmployees', formData);
    return response.data;
  },

  getAvpEmployees: async (rptAvpId) => {
    console.log('🟢 REAL: POST /api/manager/GetAvpEmployees');
    const formData = new FormData();
    formData.append('RptAvpId', rptAvpId);
    const response = await apiClient.post('/api/manager/GetAvpEmployees', formData);
    return response.data;
  },

  // ==========================================
  // COMMON / UTILS
  // ==========================================

  updateTravelStatus: async (tId, status, empId, comment = '') => {
    console.log('🟢 REAL: POST /api/UpdateTravelStatus', { tId, status, empId, comment });
    
    const formData = new FormData();
    formData.append('TID', String(tId));
    formData.append('Status', String(status));
    formData.append('EmpId', String(empId || ''));
    formData.append('Comment', comment || 'Status updated');
    
    const response = await apiClient.post('/api/UpdateTravelStatus', formData);
    return response.data;
  },

  getAllDocumentsList: async () => {
    console.log('🟢 REAL: GET /api/GetAllDocumentsList');
    const response = await apiClient.get('/api/GetAllDocumentsList');
    return response.data;
  },

  getRollMaster: async () => {
    console.log('🟢 REAL: GET /api/GetRollMaster');
    const response = await apiClient.get('/api/GetRollMaster');
    return response.data;
  },

  getStatusMaster: async () => {
    console.log('🟢 REAL: GET /api/GetStatusMaster');
    const response = await apiClient.get('/api/GetStatusMaster');
    return response.data;
  },

  // ==========================================
  // DOCUMENT MANAGEMENT (Using Employee Endpoints Only)
  // ==========================================

  addDocument: async (empId, documentId, document) => {
    console.log('🟢 REAL: POST /api/employee/AddDocument');
    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);
    formData.append('Document', document);
    const response = await apiClient.post('/api/employee/AddDocument', formData);
    return response.data;
  },

  addDocumentWithMetadata: async (empId, documentId, document, fileType, fileName, fileSize) => {
    console.log('🟢 REAL: POST /api/employee/AddDocumentWithMetadata');
    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);
    formData.append('Document', document);
    formData.append('FileType', fileType || '');
    formData.append('FileName', fileName || '');
    formData.append('FileSize', fileSize || 0);
    const response = await apiClient.post('/api/employee/AddDocumentWithMetadata', formData);
    return response.data;
  },

  getEmployeeAllDocuments: async (empId) => {
    console.log('🟢 REAL: GET /api/employee/GetUploadedDocuments?empId=' + empId);
    const response = await apiClient.get(`/api/employee/GetUploadedDocuments?empId=${empId}`);
    return response.data;
  },

  getDocumentFile: async (empId, documentId) => {
    console.log('🟢 REAL: POST /api/employee/GetDocumentFile');
    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);
    const response = await apiClient.post('/api/employee/GetDocumentFile', formData);
    return response.data;
  },

  deleteDocument: async (empId, documentId) => {
    console.log('🟢 REAL: DELETE /api/employee/DeleteDocument');
    const response = await apiClient.delete(`/api/employee/DeleteDocument?empId=${empId}&documentId=${documentId}`);
    return response.data;
  },

  // ==========================================
  // PASSPORT OCR
  // ==========================================

  getPassportInfo: async (empId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetPassportInfo');
    const formData = new FormData();
    formData.append('EmpId', empId);
    const response = await apiClient.post('/api/HelpDesk/GetPassportInfo', formData);
    return response.data;
  },

  updatePassportInfo: async (empId, passportData) => {
    console.log('🟢 REAL: POST /api/employee/UpdatePassportInfo', { empId });
    const formData = new FormData();
    
    formData.append('EmpId', String(empId));
    formData.append('Issuer', passportData.issuer || '');
    formData.append('FullName', passportData.fullName || '');
    formData.append('PassportNumber', passportData.passportNumber || '');
    formData.append('Nationality', passportData.nationality || '');
    
    if (passportData.dateOfBirth) {
      let dob = passportData.dateOfBirth;
      if (!dob.includes('T')) {
        dob = new Date(dob + 'T00:00:00').toISOString();
      }
      formData.append('DateOfBirth', dob);
    } else {
      formData.append('DateOfBirth', '');
    }
    
    formData.append('Sex', passportData.sex || '');
    
    if (passportData.expiryDate) {
      let expiry = passportData.expiryDate;
      if (!expiry.includes('T')) {
        expiry = new Date(expiry + 'T00:00:00').toISOString();
      }
      formData.append('ExpiryDate', expiry);
    } else {
      formData.append('ExpiryDate', '');
    }
    
    formData.append('CompositeCheck', String(passportData.compositeCheck ?? true));
    
    const response = await apiClient.post('/api/employee/UpdatePassportInfo', formData);
    return response.data;
  },

  // ==========================================
  // VISA OCR
  // ==========================================

  getVisaInfo: async (empId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetVisaInfo');
    const formData = new FormData();
    formData.append('EmpId', empId);
    
    try {
      const response = await apiClient.post('/api/HelpDesk/GetVisaInfo', formData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('🟡 GetVisaInfo endpoint not available');
        return { status: 'NotFound', fallbackRequired: true };
      }
      throw error;
    }
  },

  updateVisaInfo: async (empId, visaData) => {
    console.log('🟢 REAL: POST /api/HelpDesk/UpdateVisaInfo', { empId });
    const formData = new FormData();
    
    formData.append('EmpId', String(empId));
    formData.append('Issuer', visaData.issuer || '');
    formData.append('FullName', visaData.fullName || '');
    formData.append('VisaNumber', visaData.visaNumber || '');
    formData.append('Nationality', visaData.nationality || '');
    
    if (visaData.dateOfBirth) {
      let dob = visaData.dateOfBirth;
      if (!dob.includes('T')) {
        dob = new Date(dob + 'T00:00:00').toISOString();
      }
      formData.append('DateOfBirth', dob);
    } else {
      formData.append('DateOfBirth', '');
    }
    
    formData.append('Sex', visaData.sex || '');
    
    if (visaData.expiryDate) {
      let expiry = visaData.expiryDate;
      if (!expiry.includes('T')) {
        expiry = new Date(expiry + 'T00:00:00').toISOString();
      }
      formData.append('ExpiryDate', expiry);
    } else {
      formData.append('ExpiryDate', '');
    }
    
    formData.append('CompositeCheck', String(visaData.compositeCheck ?? true));
    
    const response = await apiClient.post('/api/HelpDesk/UpdateVisaInfo', formData);
    return response.data;
  },

  // ==========================================
  // TRAVEL DESK / HELPDESK SPECIFIC
  // ==========================================

  getAllTravelDetails: async () => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetAllTravelDetails');
    const response = await apiClient.post('/api/HelpDesk/GetAllTravelDetails');
    return response.data;
  },

  getAllTravelDetails: async () => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetAllTravelDetails');
    const response = await apiClient.post('/api/HelpDesk/GetAllTravelDetails');
    return response.data;
  },

  getPassportInfo: async (empId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetPassportInfo');
    const formData = new FormData();
    formData.append('EmpId', empId);
    const response = await apiClient.post('/api/HelpDesk/GetPassportInfo', formData);
    return response.data;
  },
};

export default realApi;