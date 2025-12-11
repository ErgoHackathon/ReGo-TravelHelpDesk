/**
 * Real API - All actual HTTP calls
 * Complete version with SVP/AVP support
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

  getTravelDetailByTId: async (tId) => {
    console.log('🟢 REAL: POST /api/employee/TravelDetailByTID');
    const formData = new FormData();
    formData.append('TID', tId);
    const response = await apiClient.post('/api/employee/TravelDetailByTID', formData);
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
    // Backend expects array of TravelMaster objects
    const dataArray = Array.isArray(travelData) ? travelData : [travelData];
    const response = await apiClient.post('/api/manager/InsertTravelDetail', dataArray, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // ==========================================
  // SVP SPECIFIC
  // ==========================================

  getSvpEmployees: async (rptSvpId) => {
    console.log('🟢 REAL: POST /api/manager/GetSvpEmployees');
    const formData = new FormData();
    formData.append('RptSvpId', rptSvpId);
    const response = await apiClient.post('/api/manager/GetSvpEmployees', formData);
    return response.data;
  },

  // ==========================================
  // AVP SPECIFIC
  // ==========================================

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

  updateTravelStatus: async (tId, status) => {
    console.log('🟢 REAL: POST /api/UpdateTravelStatus', { tId, status });
    const formData = new FormData();
    formData.append('TID', tId);
    formData.append('Status', status);
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
  // DOCUMENT MANAGEMENT
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
  // TRAVEL DESK / HELPDESK SPECIFIC
  // ==========================================

  getEmployeeDocuments: async (empId, docId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetEmployeeDocuments');
    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', docId);
    const response = await apiClient.post('/api/HelpDesk/GetEmployeeDocuments', formData);
    return response.data;
  },

  getHelpDeskDocumentFile: async (empId, documentId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetDocumentFile');
    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);
    const response = await apiClient.post('/api/HelpDesk/GetDocumentFile', formData);
    return response.data;
  },

  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('🟢 REAL: GET /api/HelpDesk/GetUploadedDocuments?empId=' + empId);
    const response = await apiClient.get(`/api/HelpDesk/GetUploadedDocuments?empId=${empId}`);
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