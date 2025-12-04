/**
 * Document Service
 * Handles all document-related API calls
 */

import api from './apiService';

const documentService = {
  /**
   * Get all document types
   * API: GET /api/GetAllDocumentsList
   * Response: { status: "Success", result: [{ documentID, documentName }] }
   */
  getAllDocumentTypes: async () => {
    console.log('📄 Getting all document types');

    const response = await api.getAllDocumentsList();

    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch document types');
    }

    // Transform to frontend format
    return response.result.map(doc => ({
      id: doc.documentID,
      name: doc.documentName
    }));
  },

  /**
   * Convert file to Base64 string
   * @param {File} file - File object
   * @returns {Promise<string>} - Base64 encoded string
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // Get base64 string (remove data:xxx;base64, prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Validate file type and size
   * @param {File} file - File object
   * @returns {object} - { valid: boolean, error: string | null }
   */
  validateFile: (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PNG, JPG, and PDF files are allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    return { valid: true, error: null };
  },

  /**
   * Add document for employee
   * API: POST /api/employee/AddDocument
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document type ID
   * @param {File} file - Document file
   */
  addDocument: async (empId, documentId, file) => {
    console.log('📄 Adding document:', { empId, documentId, fileName: file.name });

    // Validate file
    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert file to Base64
    const fileBase64 = await documentService.fileToBase64(file);
    console.log('📄 File converted to Base64, length:', fileBase64.length);

    // Call API
    const response = await api.addDocument(empId, documentId, fileBase64);

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to upload document');
    }

    return response.result;
  },

  /**
   * Update document for employee
   * API: POST /api/employee/UpdateDocument
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document type ID
   * @param {File} file - Document file
   */
  updateDocument: async (empId, documentId, file) => {
    console.log('📄 Updating document:', { empId, documentId, fileName: file.name });

    // Validate file
    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert file to Base64
    const fileBase64 = await documentService.fileToBase64(file);

    // Call API
    const response = await api.updateDocument(empId, documentId, fileBase64);

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to update document');
    }

    return response.result;
  },

  /**
   * Get employee document
   * API: POST /api/HelpDesk/GetEmployeeDocuments
   * @param {string} empId - Employee ID
   * @param {number} docId - Document type ID
   */
  getEmployeeDocument: async (empId, docId) => {
    console.log('📄 Getting employee document:', { empId, docId });

    const response = await api.getEmployeeDocuments(empId, docId);

    if (response.status !== 'Success') {
      return null;
    }

    return response.result;
  },
  // Add this function to documentService.js

/**
 * Get all uploaded documents for an employee
 * @param {string} empId - Employee ID
 */
getEmployeeUploadedDocuments: async (empId) => {
  console.log('📄 Getting all uploaded documents for:', empId);

  const response = await api.getEmployeeAllDocuments(empId);

  if (response.status !== 'Success') {
    return [];
  }

  return response.result || [];
},

  /**
   * Upload or update document (auto-detect)
   * @param {string} empId - Employee ID
   * @param {number} documentId - Document type ID
   * @param {File} file - Document file
   * @param {boolean} isUpdate - Whether this is an update
   */
  uploadDocument: async (empId, documentId, file, isUpdate = false) => {
    if (isUpdate) {
      return documentService.updateDocument(empId, documentId, file);
    }
    return documentService.addDocument(empId, documentId, file);
  }
};

export default documentService;