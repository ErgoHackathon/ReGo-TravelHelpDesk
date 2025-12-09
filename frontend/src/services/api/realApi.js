/**
 * Real API - All actual HTTP calls
 */

import apiClient from '../../api/client';

const realApi = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  
  // POST /api/LoginRequest
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

  // POST /api/employee/GetEmployeeData
  getEmployeeData: async (idOrEmail) => {
    console.log('🟢 REAL: POST /api/employee/GetEmployeeData');

    const formData = new FormData();
    formData.append('IDorEmail', idOrEmail);

    const response = await apiClient.post('/api/employee/GetEmployeeData', formData);
    return response.data;
  },

  // POST /api/employee/TravelDetailByEmpId?id=xxx
  getTravelDetailByEmpId: async (empId) => {
    console.log('🟢 REAL: POST /api/employee/TravelDetailByEmpId?id=' + empId);

    const response = await apiClient.post(`/api/employee/TravelDetailByEmpId?id=${empId}`, null);
    return response.data;
  },

  // ==========================================
  // MANAGER
  // ==========================================

  // POST /api/manager/GetEmployeesByRptId
  getEmployeesByRptId: async (managerId) => {
    console.log('🟢 REAL: POST /api/manager/GetEmployeesByRptId');

    const formData = new FormData();
    formData.append('ID', managerId);

    const response = await apiClient.post('/api/manager/GetEmployeesByRptId', formData);
    return response.data;
  },

  // POST /api/manager/TravelDetailByRptId
  getTravelDetailByRptId: async (managerId) => {
    console.log('🟢 REAL: POST /api/manager/TravelDetailByRptId');

    const formData = new FormData();
    formData.append('id', managerId);

    const response = await apiClient.post('/api/manager/TravelDetailByRptId', formData);
    return response.data;
  },

  // POST /api/manager/InsertTravelDetail
  insertTravelDetail: async (travelData) => {
    console.log('🟢 REAL: POST /api/manager/InsertTravelDetail');

    const response = await apiClient.post('/api/manager/InsertTravelDetail', [travelData], {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // ==========================================
  // COMMON
  // ==========================================

  // POST /api/UpdateTravelStatus
  updateTravelStatus: async (empId, status) => {
    console.log('🟢 REAL: POST /api/UpdateTravelStatus');

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('status', status);

    const response = await apiClient.post('/api/UpdateTravelStatus', formData);
    return response.data;
  },

  // GET /api/GetAllDocumentsList
  getAllDocumentsList: async () => {
    console.log('🟢 REAL: GET /api/GetAllDocumentsList');

    const response = await apiClient.get('/api/GetAllDocumentsList');
    return response.data;
  },

  // GET /api/GetRollMaster
  getRollMaster: async () => {
    console.log('🟢 REAL: GET /api/GetRollMaster');

    const response = await apiClient.get('/api/GetRollMaster');
    return response.data;
  },

  // ==========================================
  // DOCUMENT MANAGEMENT - EMPLOYEE
  // ==========================================

  /**
   * Add document (backward compatible - no metadata)
   * POST /api/employee/AddDocument
   */
  addDocument: async (empId, documentId, document) => {
    console.log('🟢 REAL: POST /api/employee/AddDocument');

    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);
    formData.append('Document', document);

    const response = await apiClient.post('/api/employee/AddDocument', formData);
    return response.data;
  },

  /**
   * Add document WITH metadata (FileType, FileName, FileSize)
   * POST /api/employee/AddDocumentWithMetadata
   */
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

  /**
   * Update document (uses AddDocumentWithMetadata - backend handles update)
   * POST /api/employee/AddDocumentWithMetadata
   */
  updateDocument: async (empId, documentId, document, fileType, fileName, fileSize) => {
    console.log('🟢 REAL: POST /api/employee/AddDocumentWithMetadata (Update)');
    
    // Backend AddDocument method handles both insert and update
    return realApi.addDocumentWithMetadata(empId, documentId, document, fileType, fileName, fileSize);
  },

  /**
   * Get list of all uploaded documents for an employee (without base64)
   * GET /api/employee/GetUploadedDocuments?empId=xxx
   */
  getEmployeeAllDocuments: async (empId) => {
    console.log('🟢 REAL: GET /api/employee/GetUploadedDocuments?empId=' + empId);

    const response = await apiClient.get(`/api/employee/GetUploadedDocuments?empId=${empId}`);
    return response.data;
  },

  /**
   * Get document file with base64 content (for preview)
   * POST /api/employee/GetDocumentFile
   */
  getDocumentFile: async (empId, documentId) => {
    console.log('🟢 REAL: POST /api/employee/GetDocumentFile');

    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);

    const response = await apiClient.post('/api/employee/GetDocumentFile', formData);
    return response.data;
  },

  /**
   * Delete document
   * DELETE /api/employee/DeleteDocument?empId=xxx&documentId=xxx
   */
  deleteDocument: async (empId, documentId) => {
    console.log('🟢 REAL: DELETE /api/employee/DeleteDocument');

    const response = await apiClient.delete(`/api/employee/DeleteDocument?empId=${empId}&documentId=${documentId}`);
    return response.data;
  },

  // ==========================================
  // DOCUMENT MANAGEMENT - HELPDESK / TRAVEL DESK
  // ==========================================

  /**
   * Get employee documents (backward compatible - returns bytes)
   * POST /api/HelpDesk/GetEmployeeDocuments
   */
  getEmployeeDocuments: async (empId, docId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetEmployeeDocuments');

    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', docId);

    const response = await apiClient.post('/api/HelpDesk/GetEmployeeDocuments', formData);
    return response.data;
  },

  /**
   * Get document file with base64 content (for HelpDesk preview/download)
   * POST /api/HelpDesk/GetDocumentFile
   */
  getHelpDeskDocumentFile: async (empId, documentId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetDocumentFile');

    const formData = new FormData();
    formData.append('EmpId', empId);
    formData.append('DocumentId', documentId);

    const response = await apiClient.post('/api/HelpDesk/GetDocumentFile', formData);
    return response.data;
  },

  /**
   * Get list of all uploaded documents for an employee (HelpDesk view)
   * GET /api/HelpDesk/GetUploadedDocuments?empId=xxx
   */
  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('🟢 REAL: GET /api/HelpDesk/GetUploadedDocuments?empId=' + empId);

    const response = await apiClient.get(`/api/HelpDesk/GetUploadedDocuments?empId=${empId}`);
    return response.data;
  }
};

export default realApi;