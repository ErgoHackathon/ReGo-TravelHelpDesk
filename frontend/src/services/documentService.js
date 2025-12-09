/**
 * Document Service
 * Handles all document-related API calls
 */

import api from './apiService';

const documentService = {
  /**
   * Get all document types
   * API: GET /api/GetAllDocumentsList
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
   * Add document for employee WITH metadata
   * API: POST /api/employee/AddDocumentWithMetadata
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

    // Call API with metadata
    const response = await api.addDocumentWithMetadata(
      empId,
      documentId,
      fileBase64,
      file.type,      // FileType (e.g., "image/png", "application/pdf")
      file.name,      // FileName (e.g., "passport.jpg")
      file.size       // FileSize in bytes
    );

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to upload document');
    }

    return response.result;
  },

  /**
   * Update document for employee
   * API: POST /api/employee/AddDocumentWithMetadata (backend handles update)
   */
  updateDocument: async (empId, documentId, file) => {
    console.log('📄 Updating document:', { empId, documentId, fileName: file.name });

    // Same as addDocument - backend handles the update logic
    return documentService.addDocument(empId, documentId, file);
  },

  /**
   * Upload or update document (auto-detect)
   */
  uploadDocument: async (empId, documentId, file, isUpdate = false) => {
    if (isUpdate) {
      return documentService.updateDocument(empId, documentId, file);
    }
    return documentService.addDocument(empId, documentId, file);
  },

  /**
   * Get all uploaded documents for an employee (list without base64)
   * API: GET /api/employee/GetUploadedDocuments?empId=xxx
   * @returns {Object} - Map of documentId -> document info
   */
  getEmployeeUploadedDocuments: async (empId) => {
    console.log('📄 Getting all uploaded documents for:', empId);

    try {
      const response = await api.getEmployeeAllDocuments(empId);

      if (response.status !== 'Success') {
        console.log('📄 No documents found or API error');
        return {};
      }

      // Transform array to map by documentId
      const documentsMap = {};
      if (response.result && Array.isArray(response.result)) {
        response.result.forEach(doc => {
          documentsMap[doc.documentID] = {
            empDocId: doc.empDocId,
            fileName: doc.fileName || `Document_${doc.documentID}`,
            fileType: doc.fileType || 'application/octet-stream',
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.createdOn,
            updatedAt: doc.updatedOn
          };
        });
      }

      console.log('📄 Uploaded documents map:', documentsMap);
      return documentsMap;
    } catch (error) {
      console.error('📄 Error fetching uploaded documents:', error);
      return {};
    }
  },

  /**
   * Get document with base64 content (for preview)
   * API: POST /api/employee/GetDocumentFile
   */
  getDocumentWithContent: async (empId, documentId) => {
    console.log('📄 Getting document with content:', { empId, documentId });

    try {
      const response = await api.getDocumentFile(empId, documentId);

      if (response.status !== 'Success' || !response.result) {
        console.log('📄 Document not found');
        return null;
      }

      return {
        empDocId: response.result.empDocId,
        fileName: response.result.fileName || `Document_${documentId}`,
        fileType: response.result.fileType || 'application/octet-stream',
        fileSize: response.result.fileSize || 0,
        base64String: response.result.base64String,
        createdOn: response.result.createdOn
      };
    } catch (error) {
      console.error('📄 Error fetching document content:', error);
      throw error;
    }
  },

  /**
   * Delete document
   * API: DELETE /api/employee/DeleteDocument?empId=xxx&documentId=xxx
   */
  deleteDocument: async (empId, documentId) => {
    console.log('📄 Deleting document:', { empId, documentId });

    const response = await api.deleteDocument(empId, documentId);

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to delete document');
    }

    return response.result;
  },

  // ==========================================
  // HELPDESK / TRAVEL DESK METHODS
  // ==========================================

  /**
   * Get all uploaded documents for an employee (HelpDesk view)
   * API: GET /api/HelpDesk/GetUploadedDocuments?empId=xxx
   */
  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('📄 [HelpDesk] Getting all uploaded documents for:', empId);

    try {
      const response = await api.getHelpDeskEmployeeDocuments(empId);

      if (response.status !== 'Success') {
        return {};
      }

      const documentsMap = {};
      if (response.result && Array.isArray(response.result)) {
        response.result.forEach(doc => {
          documentsMap[doc.documentID] = {
            empDocId: doc.empDocId,
            fileName: doc.fileName || `Document_${doc.documentID}`,
            fileType: doc.fileType || 'application/octet-stream',
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.createdOn
          };
        });
      }

      return documentsMap;
    } catch (error) {
      console.error('📄 [HelpDesk] Error fetching documents:', error);
      return {};
    }
  },

  /**
   * Get document with base64 content (for HelpDesk preview/download)
   * API: POST /api/HelpDesk/GetDocumentFile
   */
  getHelpDeskDocumentWithContent: async (empId, documentId) => {
    console.log('📄 [HelpDesk] Getting document with content:', { empId, documentId });

    try {
      const response = await api.getHelpDeskDocumentFile(empId, documentId);

      if (response.status !== 'Success' || !response.result) {
        return null;
      }

      return {
        empDocId: response.result.empDocId,
        fileName: response.result.fileName || `Document_${documentId}`,
        fileType: response.result.fileType || 'application/octet-stream',
        fileSize: response.result.fileSize || 0,
        base64String: response.result.base64String,
        createdOn: response.result.createdOn
      };
    } catch (error) {
      console.error('📄 [HelpDesk] Error fetching document content:', error);
      throw error;
    }
  }
};

export default documentService;