/**
 * Document Service
 * Handles all document-related API calls
 * Connected to real backend APIs
 */

import apiClient from '../api/client';
import apiConfig from '../config/apiConfig';

const documentService = {
  /**
   * Get all document types
   * API: GET /api/GetAllDocumentsList
   */
  getAllDocumentTypes: async () => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getAllDocumentTypes');
      return [
        { id: 1, name: 'Passport' },
        { id: 2, name: 'Invitation Letter' },
        { id: 3, name: 'Cover Letter' },
        { id: 4, name: 'KT plan' },
        { id: 5, name: 'Hotel Booking' },
        { id: 6, name: 'Flight Booking' },
        { id: 7, name: 'Travel Insurance' },
        { id: 8, name: 'Visa Form' },
        { id: 9, name: 'Letter of Intent' }
      ];
    }

    console.log('🟢 Getting all document types');

    const response = await apiClient.get('/api/GetAllDocumentsList');
    console.log('Document types response:', response.data);

    if (response.data?.status !== 'Success' || !response.data?.result) {
      throw new Error('Failed to fetch document types');
    }

    return response.data.result.map(doc => ({
      id: doc.documentID,
      name: doc.documentName
    }));
  },

  /**
   * Get employee documents (HelpDesk)
   * API: POST /api/HelpDesk/GetEmployeeDocuments
   * @param {string} empId - Employee ID
   * @param {number} docId - Document type ID
   */
  getEmployeeDocument: async (empId, docId) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getEmployeeDocument');
      return null;
    }

    console.log('🟢 Getting employee document:', { empId, docId });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('DocId', docId);

    const response = await apiClient.post('/api/HelpDesk/GetEmployeeDocuments', formData);
    console.log('Employee document response:', response.data);

    if (response.data?.status !== 'Success') {
      return null;
    }

    return response.data.result;
  },

  /**
   * Get all documents for an employee
   * @param {string} empId - Employee ID
   */
  getAllEmployeeDocuments: async (empId) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for getAllEmployeeDocuments');
      return [];
    }

    console.log('🟢 Getting all documents for employee:', empId);

    // Get all document types first
    const docTypes = await documentService.getAllDocumentTypes();
    
    // Fetch each document
    const documents = [];
    for (const docType of docTypes) {
      try {
        const doc = await documentService.getEmployeeDocument(empId, docType.id);
        if (doc) {
          documents.push({
            ...docType,
            document: doc,
            status: 'uploaded'
          });
        } else {
          documents.push({
            ...docType,
            document: null,
            status: 'pending'
          });
        }
      } catch (error) {
        documents.push({
          ...docType,
          document: null,
          status: 'pending'
        });
      }
    }

    return documents;
  },

  /**
   * Add document for employee
   * API: POST /api/employee/AddDocument
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document type ID
   * @param {File} document - Document file
   */
  addDocument: async (empId, documentId, document) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for addDocument');
      return { success: true };
    }

    console.log('🟢 Adding document:', { empId, documentId });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/AddDocument', formData);
    console.log('Add document response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error('Failed to add document');
    }

    return response.data.result;
  },

  /**
   * Update document for employee
   * API: POST /api/employee/UpdateDocument
   */
  updateDocument: async (empId, documentId, document) => {
    if (apiConfig.USE_MOCK_API) {
      console.log('🔵 Using MOCK API for updateDocument');
      return { success: true };
    }

    console.log('🟢 Updating document:', { empId, documentId });

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('documentId', documentId);
    formData.append('document', document);

    const response = await apiClient.post('/api/employee/UpdateDocument', formData);
    console.log('Update document response:', response.data);

    if (response.data?.status !== 'Success') {
      throw new Error('Failed to update document');
    }

    return response.data.result;
  },

  /**
   * Upload or update document
   * Automatically chooses add or update based on existing document
   */
  uploadDocument: async (empId, documentId, document) => {
    const existing = await documentService.getEmployeeDocument(empId, documentId);
    
    if (existing) {
      return documentService.updateDocument(empId, documentId, document);
    } else {
      return documentService.addDocument(empId, documentId, document);
    }
  }
};

export default documentService;

// Named exports for convenience
export const {
  getAllDocumentTypes,
  getEmployeeDocument,
  getAllEmployeeDocuments,
  addDocument,
  updateDocument,
  uploadDocument
} = documentService;