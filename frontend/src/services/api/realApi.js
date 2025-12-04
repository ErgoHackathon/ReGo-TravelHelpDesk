/**
 * Real API - All actual HTTP calls
 */

import apiClient from '../../api/client';  // ✅ Fixed path

const realApi = {
  // POST /api/LoginRequest
  login: async (username, password) => {
    console.log('🟢 REAL: POST /api/LoginRequest');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/api/LoginRequest', formData);
    return response.data;
  },

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

  // POST /api/employee/AddDocument
  addDocument: async (empId, documentId, document) => {
    console.log('🟢 REAL: POST /api/employee/AddDocument');

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/AddDocument', formData);
    return response.data;
  },

  // POST /api/employee/UpdateDocument
  updateDocument: async (empId, documentId, document) => {
    console.log('🟢 REAL: POST /api/employee/UpdateDocument');

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/UpdateDocument', formData);
    return response.data;
  },

  // POST /api/HelpDesk/GetEmployeeDocuments
  getEmployeeDocuments: async (empId, docId) => {
    console.log('🟢 REAL: POST /api/HelpDesk/GetEmployeeDocuments');

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('DocId', docId);

    const response = await apiClient.post('/api/HelpDesk/GetEmployeeDocuments', formData);
    return response.data;
  },

  // GET /api/GetRollMaster
  getRollMaster: async () => {
    console.log('🟢 REAL: GET /api/GetRollMaster');

    const response = await apiClient.get('/api/GetRollMaster');
    return response.data;
  }
};

export default realApi;